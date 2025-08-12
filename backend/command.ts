import {prisma} from "./src/config/config.js";

const aadhaar = await prisma.udyamRegistration.create({
    data: {
        aadhaarNumber: "802363629134",
        entrepreneurName: "Aryan Rathore",  
        mobileNumber: "8023636291",
        panNumber: "HIBPR6286R",
        panName: "Aryan Rathore",
        DOB: new Date("2005-12-31"),
        typeOfOrg: "Private Limited Company".toLowerCase().replace(" ", "_"),
    },
});

console.log(aadhaar);