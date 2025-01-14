const checkValidatorRules = {
    login: {
        email: 'required|email',
        password: 'required',
    },
    changePassword: {
        old_password: 'required',
        new_password: 'required',
    },
    updateProfile: {
        first_name: 'required',
        last_name: 'required',
    },
    updateUserStatus: {
        user_id: 'required',
        status: 'required',
    },
    deleteUser: {
        user_id: 'required',
    },
    deleteVendor: {
        user_id: 'required',
    },
    updateVendorStatus: {
        user_id: 'required',
        status: 'required',
    },
    deleteServiceProvider: {
        user_id: 'required',
    },
    updateServiceProviderStatus: {
        user_id: 'required',
        status: 'required',
    },
    getStaticPageContent: {
        role: 'required|in:0,1,2',
        tag: 'required|in:PRIVACY_POLICY,TERMS_CONDITIONS,ABOUT_US',
    },
    UpdatePageContent: {
        role: 'required|in:0,1,2',
        tag: 'required|in:PRIVACY_POLICY,TERMS_CONDITIONS,ABOUT_US',
        data: 'required',
        guj_data: 'required',
    },
    getDetails: {
        user_id: 'required',
    },
    addCategory: {
        store_category_id:'required',
        en_name: 'required',
        guj_name: 'required'
    },
    getCategoryListByStoreCategory:{
        store_category_id:'required',
    },
    categoryListRolewise: {
        role: 'required',
    },
    deleteCategory: {
        category_id: 'required',
    },
    updateCategoryStatus: {
        category_id: 'required',
        status: 'required',
    },
    getCategorydetails: {
        category_id: 'required',
    },
    updateCategoryDetails: {
        category_id: 'required',
        store_category_id:'required',
        en_name: 'required',
        guj_name: 'required'
    },
    subCategoryList:{
        category_id: 'required'
    },
    addSubCategory: {
        store_category_id:'required',
        category_id: 'required',
        en_name: 'required',
        guj_name: 'required',
    },
    deleteSubCategory: {
        subcategory_id: 'required',
    },
    updateSubCategoryStatus: {
        subcategory_id: 'required',
        status: 'required',
    },
    getSubCategorydetails: {
        subcategory_id: 'required',
    },
    updateSubCategoryDetails: {
        store_category_id:'required',
        subcategory_id: 'required',
        category_id: 'required',
        en_name: 'required',
        guj_name: 'required',
    },
    addProduct: {
        name: 'required',
        product_code: 'required',
        category_id: 'required',
        subcategory_id: 'required',
        store_id: 'required',
        user_id: 'required',
        price: 'required',
        discount: 'required',
        discount_type: 'required',
        brand: '',
        gender: '',
        color: '',
        size: '',
        shape: '',
        material: '',
        pattern: '',
        design: '',
        type: '',
        sustainable: '',
        warranty: '',
        guarantee: '',
        quantity: '',
        quality: '',
        service: '',
        replacement: '',
        resale: '',
        details: '',
        images: 'required',
    },
    getStoreProductList:{
        store_id: 'required',
    },
    deleteProduct: {
        product_id: 'required',
    },
    updateProductStatus: {
        product_id: 'required',
        status: 'required',
    },
    getProductDetails: {
        product_id: 'required',
    },
    updateproductDetails: {
        product_id: 'required',
        name: 'required',
        product_code: 'required',
        category_id: 'required',
        subcategory_id: 'required',
        store_id: 'required',
        user_id: 'required',
        price: 'required',
        discount: 'required',
        discount_type: 'required',
        brand: '',
        gender: '',
        color: '',
        size: '',
        shape: '',
        material: '',
        pattern: '',
        design: '',
        type: '',
        sustainable: '',
        warranty: '',
        guarantee: '',
        quantity: '',
        quality: '',
        service: '',
        replacement: '',
        resale: '',
        details: '',
        images: 'required',
    },
    deleteStore: {
        store_id: 'required',
    },
    getStoreDetails: {
        store_id: 'required',
    },
    updateStoreStatus: {
        store_id: 'required',
        status: 'required',
    },
    acceptRejectStore:{
        store_id: 'required',
        is_approved: 'required|in:1,2',
    },
    deleteService: {
        service_id: 'required',
    },
    getServiceDetails: {
        service_id: 'required',
    },
    updateServiceStatus: {
        service_id: 'required',
        status: 'required',
    },
    acceptRejectService:{
        service_id: 'required',
        is_approved: 'required|in:1,2',
    },
    updateSocialLinks:{
        social_id: 'required',
        instagram: 'required',
        facebook: 'required',
        youtube: 'required'
    },
    updateContactDetails:{
        contact_id: 'required',
        email: 'required|email',
        country_code: 'required',
        phone: 'required',
        image: 'required'
    },
    updateMarketPlaceStatus:{
        market_place_id: 'required',
        status: 'required',
    },
    updateMarketPlaceDetails:{
        market_place_id: 'required',
        name: 'required',
        guj_name: 'required'
    },
    deleteMarketPlace: {
        market_place_id: 'required',
    },
    addMarketPlace:{
        name: 'required',
        guj_name: 'required'
    },
    updateStoreCategoryStatus: {
        category_id: 'required',
        status: 'required',
    },
    deleteStoreCategory: {
        category_id: 'required',
    },
    addStoreCategory: {
        role:'required|in:1,2',
        en_name: 'required',
        guj_name: 'required',
        image: 'required'
    },
    getStoreCategorydetails: {
        category_id: 'required',
    },
    updateStoreCategoryDetails: {
        category_id: 'required',
        role:'required|in:1,2',
        en_name: 'required',
        guj_name: 'required',
        image: 'required'
    },
    updateSubscriptionPlanStatus:{
        subscription_plan_id: 'required',
        status: 'required',
    },
    deleteSubscriptionPlan: {
        subscription_plan_id: 'required',
    },
    addSubscriptionPlan: {
        title: 'required',
        guj_title: 'required',
        no_images: 'required',
        storage: 'required',  
        storage_type: 'required|in:0,1,2',
        monthly_price: 'required',
        yearly_price: 'required',
        guj_benefit: 'required',
        guj_payment: 'required',
        benefit: 'required',
        payment_procedure: 'required',
        is_free: 'required|in:0,1',
        type: 'required|in:1,2',
    },
    getSubscriptionPlanDetails: {
        subscription_plan_id: 'required',
    },
    updateSubscriptionPlanDetails: {
        subscription_plan_id: 'required',
        title: 'required',
        guj_title: 'required',
        no_images: 'required',
        storage: 'required',  
        storage_type: 'required|in:0,1,2',
        monthly_price: 'required',
        yearly_price: 'required',
        benefit: 'required',
        payment_procedure: 'required',
        guj_benefit: 'required',
        guj_payment: 'required',
        is_free: 'required|in:0,1',
        type: 'required|in:1,2',
    },
    updateAdManagerStatus:{
        ad_manager_id: 'required',
        status: 'required',
    },
    deleteAdManager: {
        ad_manager_id: 'required',
    },
    addAdManager:{
        market_place_id: 'required',
        role: 'required|in:1,2,3',
        sponsor_name: 'required',
        sponsor_email: 'required',
        page_name: '',
        start_date: 'required',
        end_date: 'required',
        redirect_id: 'required',
        price: 'required',
        image: 'required',
        is_default: 'required',
        store_category_id: '',
        redirect_url: '',
        payment_type: 'required',
        transaction_id: '',
    },
    editAdManager:{
        market_place_id: 'required',
        role: 'required|in:1,2,3',
        sponsor_name: 'required',
        sponsor_email: 'required',
        page_name: '',
        start_date: 'required',
        end_date: 'required',
        redirect_id: 'required',
        price: 'required',
        image: '',
        is_default: 'required',
        store_category_id: '',
        redirect_url: '',
        payment_type: 'required',
        transaction_id: '',
    },
    getAdManagerDetails: {
        ad_manager_id: 'required',
    },
    sendNotification:{
        role: 'required|in:0,1,2,3',
        title: 'required',
        message: 'required',
    },
    updateSubscriptionBuyerStatus:{
        subscription_buyer_id: 'required',
        status: 'required',
    },
    deleteSubscriptionBuyer: {
        subscription_buyer_id: 'required',
    },
    getSubscriptionBuyerDetails:{
        subscription_buyer_id: 'required',
    },
    getUsersListByRole:{
        role: 'required|in:1,2'
    },
    getStoreServiceByUser:{
        user_id: 'required'
    },
    addSubscriptionBuyer:{
        role: 'required|in:1,2',
        user_id: 'required',
        store_service_id: 'required',
        plan_id: 'required',
        start_date: 'required',
        end_date: 'required',
        is_premium: 'required',
    },
    editSubscriptionBuyer:{
        subscription_buyer_id: 'required',
        role: 'required|in:1,2',
        user_id: 'required',
        store_service_id: 'required',
        plan_id: 'required',
        start_date: 'required',
        end_date: 'required',
        is_premium: 'required',
    },
    completeUserContactus:{
        contact_us_id: 'required'
    },
    getFaqsByRole:{
        role: 'required|in:0,1,2'
    },
    updateFaqsStatus:{
        faq_id: 'required',
        status: 'required'
    },
    deleteFaqs:{
        faq_id: 'required'
    },
    addFaqs:{
        role: 'required|in:0,1,2',
        question: 'required',
        answer: 'required'
    },
    updateFaqs:{
        faq_id: 'required',
        question: 'required',
        answer: 'required'
    },
    deleteUserFeedback:{
        feedback_id: 'required'
    },
    updateUserFeedbackStatus:{
        feedback_id: 'required',
        status: 'required'
    },
    deleteFeedbackReason:{
        reason_id: 'required'
    },
    updateFeedbackReasonStatus:{
        reason_id: 'required',
        status: 'required'
    },
    addFeedbackReason:{
        data: 'required'
    },
    updateFeedbackReason:{
        reason_id: 'required',
        en_name: 'required',
        guj_name: 'required'
    },
    updateSponsorshipDetails:{
        sponsorship_id: 'required',
        data: 'required'
    },
    addAppVersion: {
        type:'required',
        androidapp_version: 'required',
        iosapp_version: 'required',
        en_message: 'required',
        guj_message: 'required'
    },
    updateAppVersionStatus: {
        id:'required',
        status: 'required',
    },
    deleteAppVersion: {
        id:'required'
    }
};

export default checkValidatorRules;
