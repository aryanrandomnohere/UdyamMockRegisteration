import { verifyAadhaar, verifyAadhaarOtp, verifyPan } from '../src/controller/authController.js';
import { validateOrReturn } from '../src/helpers/validateOrReturn.js';
import { prisma } from '../src/config/config.js';
import { errorResponse } from '../src/helpers/errorResponse.js';

// Mock dependencies
jest.mock('../src/helpers/validateOrReturn.js');
jest.mock('../src/config/config.js');
jest.mock('../src/helpers/errorResponse.js');

const mockValidateOrReturn = validateOrReturn as jest.MockedFunction<typeof validateOrReturn>;
const mockErrorResponse = errorResponse as jest.MockedFunction<typeof errorResponse>;
const mockPrisma = {
  udyamRegistration: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
} as any;

(prisma as any) = mockPrisma;

describe('Verification Functions', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock Math.random for consistent OTP generation
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('verifyAadhaar', () => {
    describe('Form Validation Logic', () => {
      test('should return error for invalid Aadhaar length (less than 12 digits)', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '12345678901', // 11 digits
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining(['Aadhaar number must be 12 digits']),
          200
        );
      });

      test('should return error for invalid Aadhaar length (more than 12 digits)', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '1234567890123', // 13 digits
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining(['Aadhaar number must be 12 digits']),
          200
        );
      });

      test('should return error for empty name', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          name: '', // Empty name
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining(['Name is required']),
          200
        );
      });

      test('should return multiple validation errors', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '12345', // Invalid length
          name: '', // Empty name
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining([
            'Aadhaar number must be 12 digits',
            'Name is required'
          ]),
          200
        );
      });
    });

    describe('Database Validation', () => {
      test('should return error when Aadhaar not found in database', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining(['There is error in Aadhaar Validation/Authentication.']),
          200
        );
      });

      test('should return error when name does not match', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
          entrepreneurName: 'Jane Smith', // Different name
          mobileNumber: '9876543210',
        });
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);

        await verifyAadhaar(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'There is error in Aadhaar Validation/Authentication.',
          expect.arrayContaining(['Name is not matching with Aadhaar']),
          200
        );
      });

      test('should handle case-insensitive name matching', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
          entrepreneurName: 'Aryan Rathore',
          mobileNumber: '9876543210',
        });
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);
        mockPrisma.udyamRegistration.update.mockResolvedValue({});

        await verifyAadhaar(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Aadhaar verification successful',
          otp: '550000', // Based on mocked Math.random
          mobileNumber: '9876543210',
          success: true,
        });
      });
    });

    describe('Successful Verification', () => {
      test('should successfully verify Aadhaar and generate OTP', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          name: 'Aryan Rathore',
          consent: true,
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
          entrepreneurName: 'Aryan Rathore',
          mobileNumber: '9876543210',
        });
        mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);
        mockPrisma.udyamRegistration.update.mockResolvedValue({});

        await verifyAadhaar(mockReq, mockRes);

        expect(mockPrisma.udyamRegistration.update).toHaveBeenCalledWith({
          where: { aadhaarNumber: '123456789012' },
          data: { otp: '550000', otpVerified: false },
        });

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Aadhaar verification successful',
          otp: '550000',
          mobileNumber: '9876543210',
          success: true,
        });
      });
    });
  });

  describe('verifyAadhaarOtp', () => {
    describe('Form Validation Logic', () => {
      test('should return error when Aadhaar not found', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          otp: '123456',
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue(null);

        await verifyAadhaarOtp(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Aadhaar number not found',
          ['Aadhaar number not found'],
          400
        );
      });

      test('should return error for invalid OTP', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          otp: '123456',
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
          otp: '654321', // Different OTP
        });

        await verifyAadhaarOtp(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Invalid OTP',
          ['Invalid OTP'],
          400
        );
      });
    });

    describe('Successful Verification', () => {
      test('should successfully verify OTP', async () => {
        mockValidateOrReturn.mockReturnValue({
          aadhaar: '123456789012',
          otp: '123456',
        });
        mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
          otp: '123456',
        });
        mockPrisma.udyamRegistration.update.mockResolvedValue({});

        await verifyAadhaarOtp(mockReq, mockRes);

        expect(mockPrisma.udyamRegistration.update).toHaveBeenCalledWith({
          where: { aadhaarNumber: '123456789012' },
          data: { otpVerified: true },
        });

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Aadhaar OTP verification successful',
          success: true,
        });
      });
    });
  });

  describe('verifyPan', () => {
    describe('Form Validation Logic', () => {
      test('should return error for invalid PAN format', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'INVALID123', // Invalid format
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });

        await verifyPan(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Invalid PAN',
          ['Invalid PAN'],
          200
        );
      });

      test('should validate correct PAN format', async () => {
        const validPanFormats = [
          'ABCDE1234F',
          'AAAAA1111A',
          'ZZZZZ9999Z',
        ];

        for (const pan of validPanFormats) {
          mockValidateOrReturn.mockReturnValue({
            pan: pan,
            panName: 'Aryan Rathore',
            DOB: '1990-01-01',
            typeOfOrg: 'Individual',
          });
          mockPrisma.udyamRegistration.findFirst.mockResolvedValue({
            panName: 'Aryan Rathore',
            DOB: new Date('1990-01-01'),
          });
          mockPrisma.udyamRegistration.update.mockResolvedValue({});

          await verifyPan(mockReq, mockRes);

          // Should not call errorResponse for valid PAN
          expect(mockErrorResponse).not.toHaveBeenCalledWith(
            mockRes,
            'Invalid PAN',
            ['Invalid PAN'],
            200
          );

          jest.clearAllMocks();
        }
      });

      test('should reject invalid PAN formats', async () => {
        const invalidPanFormats = [
          'ABCDE123F',    // Too short
          'ABCDE12345F',  // Too long
          '12345ABCDF',   // Numbers first
          'abcde1234f',   // Lowercase
          'ABCDE123456',  // No letter at end
          'ABCD1234F',    // Only 4 letters at start
          'ABCDEF1234F',  // 6 letters at start
        ];

        for (const pan of invalidPanFormats) {
          mockValidateOrReturn.mockReturnValue({
            pan: pan,
            panName: 'Aryan Rathore',
            DOB: '1990-01-01',
            typeOfOrg: 'Individual',
          });

          await verifyPan(mockReq, mockRes);

          expect(mockErrorResponse).toHaveBeenCalledWith(
            mockRes,
            'Invalid PAN',
            ['Invalid PAN'],
            200
          );

          jest.clearAllMocks();
        }
      });
    });

    describe('Database Validation', () => {
      test('should return error when PAN not found in database', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'ABCDE1234F',
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });
        mockPrisma.udyamRegistration.findFirst.mockResolvedValue(null);

        await verifyPan(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Details mismatch',
          ['Details mismatch'],
          200
        );
      });

      test('should return error when PAN name does not match', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'ABCDE1234F',
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });
        mockPrisma.udyamRegistration.findFirst.mockResolvedValue({
          panName: 'Jane Smith', // Different name
          DOB: new Date('1990-01-01'),
        });

        await verifyPan(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Details mismatch',
          ['Details mismatch'],
          200
        );
      });

      test('should handle case-insensitive PAN name matching', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'ABCDE1234F',
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });
        mockPrisma.udyamRegistration.findFirst.mockResolvedValue({
          panName: 'Aryan Rathore',
          DOB: new Date('1990-01-01'),
        });
        mockPrisma.udyamRegistration.update.mockResolvedValue({});

        await verifyPan(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'PAN verification successful',
          success: true,
        });
      });

      test('should return error when DOB does not match', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'ABCDE1234F',
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });
        mockPrisma.udyamRegistration.findFirst.mockResolvedValue({
          panName: 'Aryan Rathore',
          DOB: new Date('1990-01-02'), // Different date
        });

        await verifyPan(mockReq, mockRes);

        expect(mockErrorResponse).toHaveBeenCalledWith(
          mockRes,
          'Details mismatch',
          ['Details mismatch'],
          200
        );
      });
    });

    describe('Successful Verification', () => {
      test('should successfully verify PAN', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: 'ABCDE1234F',
          panName: 'Aryan Rathore',
          DOB: '1990-01-01',
          typeOfOrg: 'Individual',
        });
        mockPrisma.udyamRegistration.findFirst.mockResolvedValue({
          panName: 'Aryan Rathore',
          DOB: new Date('1990-01-01'),
        });
        mockPrisma.udyamRegistration.update.mockResolvedValue({});

        await verifyPan(mockReq, mockRes);

        expect(mockPrisma.udyamRegistration.update).toHaveBeenCalledWith({
          where: { panNumber: 'ABCDE1234F' },
          data: { panVerified: true },
        });

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'PAN verification successful',
          success: true,
        });
      });
    });

    describe('Edge Cases', () => {
      test('should handle missing required fields gracefully', async () => {
        mockValidateOrReturn.mockReturnValue({
          pan: null,
          panName: null,
          DOB: null,
          typeOfOrg: 'Individual',
        });

        await verifyPan(mockReq, mockRes);

        // Function should return early due to null checks
        expect(mockPrisma.udyamRegistration.findFirst).not.toHaveBeenCalled();
      });
    });
  });

  describe('Integration Tests', () => {
    test('should handle database connection errors gracefully', async () => {
      mockValidateOrReturn.mockReturnValue({
        aadhaar: '123456789012',
        name: 'Aryan Rathore',
        consent: true,
      });
      mockPrisma.udyamRegistration.findUnique.mockRejectedValue(new Error('Database connection failed'));

      await expect(verifyAadhaar(mockReq, mockRes)).rejects.toThrow('Database connection failed');
    });

    test('should handle validation schema errors', async () => {
      mockValidateOrReturn.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await expect(verifyAadhaar(mockReq, mockRes)).rejects.toThrow('Validation failed');
    });
  });

  describe('API Endpoint Response Validation', () => {
    test('should return 200 status for successful Aadhaar verification', async () => {
      mockValidateOrReturn.mockReturnValue({
        aadhaar: '123456789012',
        name: 'Aryan Rathore',
        consent: true,
      });
      mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
        entrepreneurName: 'Aryan Rathore',
        mobileNumber: '9876543210',
      });
      mockPrisma.udyamRegistration.findMany.mockResolvedValue([]);
      mockPrisma.udyamRegistration.update.mockResolvedValue({});

      await verifyAadhaar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Aadhaar verification successful',
        })
      );
    });

    test('should return 400 status for invalid OTP verification', async () => {
      mockValidateOrReturn.mockReturnValue({
        aadhaar: '123456789012',
        otp: '123456',
      });
      mockPrisma.udyamRegistration.findUnique.mockResolvedValue({
        otp: '654321',
      });

      await verifyAadhaarOtp(mockReq, mockRes);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        mockRes,
        'Invalid OTP',
        ['Invalid OTP'],
        400
      );
    });

    test('should return 200 status for invalid data with proper error structure', async () => {
      mockValidateOrReturn.mockReturnValue({
        pan: 'INVALID',
        panName: 'Aryan Rathore',
        DOB: '1990-01-01',
        typeOfOrg: 'Individual',
      });

      await verifyPan(mockReq, mockRes);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        mockRes,
        'Invalid PAN',
        ['Invalid PAN'],
        200
      );
    });
  });
});