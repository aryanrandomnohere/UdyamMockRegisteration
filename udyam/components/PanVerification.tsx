import { useState } from "react";
import axios from "axios";
export default function PanVerification() {
  const [typeOfOrg, setTypeOfOrg] = useState("");
  const [pan, setPan] = useState("");
  const [panName, setPanName] = useState("");
  const [dob, setDob] = useState("");
  const [consent, setConsent] = useState(true);
  const [triedSubmitting, setTriedSubmitting] = useState(false);
  const [invalidPan, setInvalidPan] = useState(false);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);
  const typeOptions = [
    "Proprietary / एकल स्वामित्व",
    "Hindu Undivided Family / हिंदू अविभाजित परिवार (एचयूएफ)",
    "Partnership / साझेदारी",
    "Co-Operative / सहकारी",
    "Private Limited Company / प्राइवेट लिमिटेड कंपनी",
    "Public Limited Company / पब्लिक लिमिटेड कंपनी",
    "Self Help Group / स्वयं सहायता समूह",
    "Limited Liability Partnership / सीमित दायित्व भागीदारी",
    "Society / सोसाइटी",
    "Trust / ट्रस्ट",
    "Others / अन्य"
  ];

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const handleSubmit = async () => {
    setError([]);
    if(success) {
        alert("First Two Step Authentication Completed.")
      return;
    }
    setTriedSubmitting(true);

    // Check PAN validity
    if (pan.length === 10 && !panRegex.test(pan)) {
      setInvalidPan(true);
      return;
    } else {
      setInvalidPan(false);
    }
    if (!typeOfOrg || !pan || !panName || !dob || !consent || invalidPan) return;
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/udyam/pan`, { pan, panName, DOB:dob, typeOfOrg:typeOfOrg })
    if(response.data.success === false) {
      setError([...response.data.errors]);
      return;
    }
    if(response.data.success === true) {
      setSuccess(true);
    }
};

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4 sm:px-6 text-[15px] sm:text-base">
      <div className="max-w-6xl mx-auto bg-white rounded-md sm:rounded shadow">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t">
          <h3 className="font-semibold text-lg">PAN Verification</h3>
        </div>

        {/* Body */}
        <div className="py-6 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type of Organisation */}
            <div className="flex flex-col">
              <label className="block font-bold text-gray-800 mb-2">
                3. Type of Organisation / संगठन के प्रकार
              </label>
              <select
                value={typeOfOrg}
                onChange={(e) => setTypeOfOrg(e.target.value)}
                disabled={success}
                    className={`w-full border rounded px-3 py-2 ${success ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                  triedSubmitting && !typeOfOrg
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="">Select Organisation Type</option>
                {typeOptions.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {triedSubmitting && !typeOfOrg && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  Required
                </div>
              )}
            </div>

            {/* PAN */}
            <div className="flex flex-col">
              <label className="block font-bold text-gray-800 mb-2">
                4.1 PAN / पैन
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                maxLength={10}
                disabled={success}
                placeholder="ENTER PAN NUMBER"
                className={`w-full border rounded px-3 py-2 ${success ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                  triedSubmitting && (!pan || pan.length !== 10 || invalidPan)
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {triedSubmitting && !pan && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  Required
                </div>
              )}
              {triedSubmitting && pan && pan.length < 10 && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  PAN must be 10 characters
                </div>
              )}
              { pan.length >= 3 && !panRegex.test(pan) && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  Invalid PAN format
                </div>
              )}
            </div>

            {/* Name as per PAN */}
            <div className="flex flex-col">
              <label className="block font-bold text-gray-800 mb-2">
                4.1.1 Name of PAN Holder / पैन धारक का नाम
              </label>
              <input
                type="text"
                value={panName}
                disabled={success}
                onChange={(e) => setPanName(e.target.value)}
                placeholder="Name as per PAN"
                className={`w-full border rounded px-3 py-2 ${success ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black placeholder:text-gray-400 ${
                  triedSubmitting && !panName
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {triedSubmitting && !panName && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  Required
                </div>
              )}
            </div>

            {/* DOB/DOI */}
            <div className="flex flex-col">
              <label className="block font-bold text-gray-800 mb-2">
                4.1.2 DOB or DOI as per PAN / पैन के अनुसार जन्म तिथि या निगम तिथि
              </label>
              <input
                type="date"
                value={dob}
                disabled={success}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${success ? "bg-[#E9ECEF]" : ""} focus:outline-none focus:ring-2 text-black ${
                  triedSubmitting && !dob
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {triedSubmitting && !dob && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  Required
                </div>
              )}
            </div>
          </div>

          {/* Consent */}
          <div className="flex flex-col mt-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={consent}
                disabled={success}
                    onChange={(e) => setConsent(e.target.checked)}
                className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 ${success ? "bg-[#E9ECEF]" : ""} rounded focus:ring-blue-200`}
              />
              <label className="text-gray-700 leading-relaxed">
                I, the holder of the above PAN, hereby give my consent to Ministry
                of MSME, Government of India, for using my data/information
                available in the Income Tax Returns filed by me, and also the same
                available in the GST Returns and also from other Government
                organizations, for MSME classification and other official purposes,
                in pursuance of the MSMED Act, 2006.
              </label>
            </div>
            {triedSubmitting && !consent && (
              <div className="text-red-500 text-sm font-medium mt-1 ml-7">
                You must agree to the declaration
              </div>
            )}
          </div>
          {success && <div className="text-red-700 font-extrabold mt-6">
  Your PAN has been successfully verified. Some fields of the form will now be disabled and will be automatically filled based on the verified PAN data.  
  GSTIN (as per the applicability of the CGST Act 2017 and as notified by the Ministry of MSME  
  <a href="#" className="text-blue-600 px-1 underline">
    S.O. 1055(E) dated 05th March 2021
  </a>
  ) is required for Udyam Registration w.e.f. 01.04.2021.  
  You are advised to apply for GSTIN in a timely manner to avoid any inconvenience.
</div>}

          {/* Button */}
          <div className="flex flex-col mt-6">
            <button  onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-fit transition-colors"
            >
              {success ? "Continue" : "PAN Validate"}
            </button>
            {triedSubmitting && error.length > 0 && error.map((err, index) => (
              <div key={index} className="text-red-500 font-extrabold mt-0.5 ">{`${err}`}</div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
