"use client"
import { useState } from "react";
import axios from "axios";
import PanVerification from "@/components/PanVerification";

// Test data component
const TestDataPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const testData = {
    aadhaarNumber: "234567890123", // Valid Aadhaar format (12 digits)
    entrepreneurName: "Rajesh Kumar Singh",  
    mobileNumber: "9876543210",
    panNumber: "ABCDE1234F", // Valid PAN format
    panName: "Aryan Rathore",
    DOB: new Date("1990-05-15"),
    typeOfOrg: "private_limited_company",
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${fieldName} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ${isOpen ? 'w-80 max-w-[calc(100vw-2rem)]' : 'w-auto'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-t-lg hover:bg-blue-700 transition-colors flex items-center justify-between"
        >
          <span className="text-sm font-medium">Test Data</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div className="p-4 max-h-96 overflow-y-auto text-black">
            <div className="text-xs text-gray-600 ">Click to copy values for testing:</div>
            <div className="text-xs text-gray-600 mb-3">This Values are coorect and can be used for testing.</div>

            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-700 font-medium">Aadhaar Number:</label>
                <div 
                  onClick={() => copyToClipboard(testData.aadhaarNumber, 'Aadhaar Number')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.aadhaarNumber}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">Name:</label>
                <div 
                  onClick={() => copyToClipboard(testData.entrepreneurName, 'Name')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.entrepreneurName}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">Mobile:</label>
                <div 
                  onClick={() => copyToClipboard(testData.mobileNumber, 'Mobile Number')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.mobileNumber}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">PAN Number:</label>
                <div 
                  onClick={() => copyToClipboard(testData.panNumber, 'PAN Number')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.panNumber}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">PAN Name:</label>
                <div 
                  onClick={() => copyToClipboard(testData.panName, 'PAN Name')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.panName}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">DOB:</label>
                <div 
                  onClick={() => copyToClipboard(testData.DOB.toISOString().split('T')[0], 'Date of Birth')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.DOB.toISOString().split('T')[0]}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-700 font-medium">Organization Type:</label>
                <div 
                  onClick={() => copyToClipboard(testData.typeOfOrg, 'Organization Type')}
                  className="bg-gray-50 border rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {testData.typeOfOrg}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AadhaarVerification() {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [triedsubmitting, setTriedSubmitting] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [otpsent, setOtpsent] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("1234567890");
  const [currentStep, setCurrentStep] = useState<"aadhaar" | "pancard">("aadhaar");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmitting(true);
    
    let newErrors: string[] = [];
    setError([]);
    if (aadhaar.length !== 12) {
      newErrors = [...newErrors, "Aadhaar number is required"];
    }
    if (name.length === 0) {
      newErrors = [...newErrors, "Name is required"];
    }
    if(!consent) {
      return;
    }
    setError(newErrors);
    if (newErrors.length > 0) return;
    if(otpsent && currentStep === "aadhaar") {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/udyam/aadhaar/otp`, { aadhaar:aadhaar, otp:otp }) 
      //@ts-ignore
      if(response.data.success === false) {
        //@ts-ignore
        setError([...response.data.errors]);
        return;
      }
      //@ts-ignore
      if(response.data.success === true) {
        console.log("setting otpsent to false");
        setOtpsent(false);
        setCurrentStep("pancard");
        return;
      }
    }
      if(otp && otp.length !== 6) {
      setError(["OTP must be 6 digits"]);
      return;
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/udyam/aadhaar`, { aadhaar:aadhaar, name:name }) 
    setTriedSubmitting(true);
    console.log("response", response);
    //@ts-ignore
    if(response.data.success === false) {
      //@ts-ignore
      setError([...response.data.errors]);
      return;
    }
    //@ts-ignore
        if(response.data.success === true) {
      setOtpsent(true);
      //@ts-ignore
      setMobileNumber(response.data.mobileNumber as string);
      setOtpsent(true);
      //@ts-ignore
      setOtp(response.data.otp as string);
      console.log(aadhaar, name, consent);
    }

    return;
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setAadhaar(value);
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4 sm:px-6 text-[15px] sm:text-base">
        <div className="max-w-6xl mx-auto bg-white rounded-md sm:rounded shadow">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t">
            <h3 className="font-semibold text-lg">
              Aadhaar Verification With OTP
            </h3>
          </div>

          {/* Body */}
          <div className="py-6 px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhaar Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="aadhaar"
                  className="block font-bold text-gray-800 mb-2"
                >
                  1. Aadhaar Number / आधार संख्या
                </label>
                <input
                  id="aadhaar"
                  name="aadhaar"
                  type="text"
                  disabled={otpsent || currentStep === "pancard"}
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  maxLength={12}
                  placeholder="Your Aadhaar No"
                  className={`w-full border rounded px-3 py-2 ${otpsent || currentStep === "pancard" ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                    triedsubmitting && aadhaar.length !== 12
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {triedsubmitting && aadhaar.length === 0 && (
                  <div className="text-red-500 text-sm font-medium mt-1">
                    Required 
                  </div>
                )}
              </div>

              {/* Name of Entrepreneur */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="block font-bold text-gray-800 mb-2"
                >
                  2. Name of Entrepreneur / उद्यमी का नाम
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  disabled={otpsent || currentStep === "pancard"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Name as per Aadhaar"
                  className={`w-full border rounded px-3 py-2 ${otpsent || currentStep === "pancard" ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                    triedsubmitting && name.length === 0
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {triedsubmitting && name.length === 0 && (
                  <div className="text-red-500 text-sm font-medium mt-1">
                    Required
                  </div>
                )}
              </div>
            </div>

            {/* Information Bullets */}
            <ul className="list-disc list-outside text-gray-700 mt-6 ml-14 space-y-0.5">
              <li>Aadhaar number shall be required for Udyam Registration.</li>
              <li>
                The Aadhaar number shall be of the proprietor in the case of a
                proprietorship firm, of the managing partner in the case of a
                partnership firm and of a karta in the case of a Hindu Undivided
                Family (HUF).
              </li>
              <li>
                In case of a Company or a Limited Liability Partnership or a
                Cooperative Society or a Society or a Trust, the organisation or its
                authorised signatory shall provide its GSTIN (As per applicability of
                CGST Act 2017 and as notified by the ministry of MSME) vide{" "}
                <a href="#" className="text-blue-600 underline">
                  S.O. 1055(E) dated 05th March 2021
                </a>{" "}
                and PAN along with its Aadhaar number.
              </li>
            </ul>

            {/* Consent Checkbox */}
            <div className="flex flex-col mt-6">
              <div className="flex items-start space-x-3">
                <input
                  id="consent"
                  name="consent"
                  disabled={otpsent || currentStep === "pancard"}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-200"
                />
                <label htmlFor="consent" className="text-gray-700 leading-relaxed ">
                  I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as allotted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सू०ल०म०उ० मंत्रालय, भारत सरकार को अपनी सहमति देता हूं। एनआईसी / सू०ल०म०उ० मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
                </label>
              </div>
              {triedsubmitting && !consent && (
                <div className="text-red-500 text-sm font-medium mt-1 ml-7">
                  You must agree to the declaration
                </div>
              )}
            </div>
            {otpsent && (
              <div className="flex flex-col mt-6">
                <label htmlFor="otp" className="flex font-bold text-gray-800 mb-2">
                  <div className="text-red-500 font-extrabold">*</div> <div className="font-extrabold ">Enter One Time Password(OTP) Code</div>
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="OTP code"
                  className={`w-full border rounded px-3 py-2 ${otpsent || currentStep === "pancard" ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                    triedsubmitting && otp && otp.length !== 6
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                <div className="text-black font-medium mt-1 ml-1">OTP has been sent to {"******" + mobileNumber.slice(-4)}</div>
              </div>
            )}
            {/* Submit Button and Error Summary */}
            <div className="flex flex-col mt-6">
              {currentStep === "aadhaar" ? <button
                onClick={handleSubmit}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-fit transition-colors"
              >
                Validate {!otpsent && " & Generate OTP"}
              </button> : 
              <div className="text-red-700 font-extrabold mt-0.5 ml-5">Your Aadhaar has been successfully verified. You can continue Udyam Registration process.</div>
              }
              
              {/* Error Summary */}
              {triedsubmitting && error.length > 0 && error.map((err, index) => (
                <div key={index} className="text-red-500 font-extrabold mt-0.5 ml-5">{`${index + 1}. ${err}`}</div>
              ))}
            </div>
         
          </div>
        </div>
        {currentStep === "pancard" && <PanVerification />}
      </main>
      
      {/* Test Data Panel */}
      <TestDataPanel />
    </>
  );
}