import NewAnnualReport from '../models/newAnnualModel.js';

// ସବୁ Annual Reports ଆଣିବା ପାଇଁ (GET)
export const getAnnualReports = async (req, res) => {
    try {
        let doc = await NewAnnualReport.findOne({ category: 'annualReports' });
        
        // ଯଦି କିଛି ନାହିଁ, ତେବେ ଡିଫଲ୍ଟ ଭାବେ ଆପଣ ଦେଇଥିବା ପୁରୁଣା ଲିଷ୍ଟଗୁଡ଼ିକୁ ସେଟ୍ କରିଦେବ
        if (!doc) {
            const defaultItems = [
                { title: 'Annual Report 2017-2018', link: "https://staging.cydaindia.org/wp-content/uploads/2024/08/CYDA-Annual-Report-Financial-Year-2017-18.pdf" },
                { title: 'Annual Report 2018-2019', link: "https://staging.cydaindia.org/wp-content/uploads/2024/08/CYDA-Annual-Report-Financial-Year-2018-19.pdf" },
                { title: 'Annual Report 2019-2020', link: "https://staging.cydaindia.org/wp-content/uploads/2024/08/CYDA-Annual-Report-Financial-Year-2019-20.pdf" },
                { title: 'Annual Report 2020-2021', link: "https://staging.cydaindia.org/wp-content/uploads/2024/08/CYDA-Annual-Report-Financial-Year-2020-21.pdf" },
                { title: 'Annual Report 2021-2022', link: "https://staging.cydaindia.org/wp-content/uploads/2024/08/CYDA-AR-2021-2022-1.pdf" },
                { title: 'Annual Report 2022-2023', link: "https://staging.cydaindia.org/wp-content/uploads/2024/12/Annual-Repoer-2022-2023.pdf" },
                { title: 'Annual Report 2023-2024', link: "https://staging.cydaindia.org/wp-content/uploads/2024/12/CYDA-AR-2023-24.pdf" }
            ];
            doc = await NewAnnualReport.create({ category: 'annualReports', items: defaultItems });
        }

        res.status(200).json({ success: true, data: doc.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin Panel ରୁ Create, Update କିମ୍ବା Delete କରି ସାମ୍ପୂର୍ଣ୍ଣ ଲିଷ୍ଟ୍ ସେଭ୍ କରିବା ପାଇଁ (PUT)
export const updateAnnualReports = async (req, res) => {
    try {
        const { items } = req.body; // items an array of { title, link }

        const updatedDoc = await NewAnnualReport.findOneAndUpdate(
            { category: 'annualReports' },
            { items },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Annual Reports updated successfully',
            data: updatedDoc.items
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};