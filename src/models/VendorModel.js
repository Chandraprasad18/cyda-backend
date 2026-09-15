import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    // 1. Vendor Details
    legalBusinessName: { type: String, required: true },
    tradeName: { type: String },
    typeOfOrganization: { type: String, required: true },
    yearOfEstablishment: { type: String },
    natureOfBusiness: { type: String, required: true },
    website: { type: String },

    // 2. Registered Office Address
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, required: true },

    // 3. Contact Information
    primaryContactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    alternateContactPerson: { type: String },
    alternateEmail: { type: String },

    // 4. Tax & Registration Information
    panNumber: { type: String, required: true },
    gstNumber: { type: String },
    msmeRegistrationNumber: { type: String },
    companyRegistrationNumber: { type: String },

    // 5. Banking Information
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    swiftCode: { type: String },
    accountType: { type: String, required: true },

    // 6. Goods/Services Offered
    descriptionOfProductsServices: { type: String, required: true },

    // 7. Business References
    ref1OrgName: { type: String },
    ref1ContactPerson: { type: String },
    ref1Phone: { type: String },
    ref1Email: { type: String },
    ref2OrgName: { type: String },
    ref2ContactPerson: { type: String },
    ref2Phone: { type: String },
    ref2Email: { type: String },

    // 8. Compliance Declaration
    legallyRegistered: { type: String },
    infoAccurate: { type: String },
    compliesWithRegulations: { type: String },
    notBlacklisted: { type: String },
    agreesToPolicies: { type: String },

    // 10. Authorized Signatory
    signatoryName: { type: String, required: true },
    signatoryDesignation: { type: String, required: true },
    signature: { type: String, required: true },
    date: { type: String, required: true }

}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;