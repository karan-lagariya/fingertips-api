/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('tbl_medical_specialities', [
            {
                name: 'Addiction Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Allergy and Immunology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Anatomic Pathology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Anesthesiology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Audiology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Bariatric Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Bariatric Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Behavioral Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Blood Banking and Transfusion Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Cardiac Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Cardiology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Chiropractic',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Clinical Genetics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Colon and Rectal Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Comprehensive Ophthalmology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Critical Care Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Dermatology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Developmental-Behavioral Pediatrics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Diagnostic Radiology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Dietetics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Emergency Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Endocrinology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Family Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Gastroenterology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'General Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Geriatric Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Gynecology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Hematology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Hematology Oncology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Hepatology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Hospice and Palliative Care',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Infectious Diseases',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Internal Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Interventional Radiology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Maternal and Fetal Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Medical Genetics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Medical Oncology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Midwifery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Neonatology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Nephrology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Neurology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Neuromusculoskeletal Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Neurosurgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Obstetrics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Obstetrics and Gynecology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Occupational Therapy',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Oral and Maxillofacial Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Orthopedic Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Otolaryngology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Pain Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Pathology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Pediatrics',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Physical Medicine and Rehabilitation',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Physical Therapy',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Plastic Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Podiatry',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Psychiatry',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Psychology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Pulmonology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Rheumatology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Sleep Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Speech-Language Pathology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Sports Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Thoracic Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Transplant Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Trauma Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Travel Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Urgent Care',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Urology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Vascular Medicine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Vascular Surgery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Women's Health",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tbl_medical_specialities', null, {});
    },
};
