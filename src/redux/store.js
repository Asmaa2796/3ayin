import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";  
import PublishAdSlice from "./Slices/PublishAdSlice"; 
import CategoriesSlice from "./Slices/CategoriesSlice";
import SubCategoriesSlice from "./Slices/SubCategoriesSlice"; 
import SubCatsOfSubCategoriesSlice from "./Slices/SubCatsOfSubCategoriesSlice"; 
import AdsSlice from "./Slices/AdsSlice"; 
import GetAdSlice from "./Slices/GetAdSlice"; 
import FAQSlice from "./Slices/FAQSlice"; 
import HowItWorksSlice from "./Slices/HowItWorksSlice"; 
import AboutSlice from "./Slices/AboutSlice"; 
import SettingsSlice from "./Slices/SettingsSlice"; 
import ProviderDataSlice from "./Slices/ProviderDataSlice"; 
import ProviderAdsSlice from "./Slices/ProviderAdsSlice"; 
import ProviderAdsReviewsSlice from "./Slices/ProviderAdsReviewsSlice"; 
import ProviderStatisticsSlice from "./Slices/ProviderStatisticsSlice"; 
import ContactSlice from "./Slices/ContactSlice"; 
import PrivacyPolicySlice from "./Slices/PrivacyPolicySlice"; 
import TermsAndConditionsSlice from "./Slices/TermsAndConditionsSlice"; 
import UserIdentifiesSlice from "./Slices/UserIdentifiesSlice"; 
import FilterServicesSlice from "./Slices/FilterServicesSlice"; 
import AddPropertySlice from "./Slices/AddPropertySlice"; 
import AllPropertiesSlice from "./Slices/AllPropertiesSlice"; 
import PlansSlice from "./Slices/PlansSlice"; 
import SubscribePlanSlice from "./Slices/SubscribePlanSlice"; 
import SearchSlice from "./Slices/SearchSlice"; 
const store = configureStore({
  reducer: {
    auth: authReducer,
    ad: PublishAdSlice,
    categories: CategoriesSlice,
    subcategories: SubCategoriesSlice,
    subCatsOfSubCategories: SubCatsOfSubCategoriesSlice,
    ads: AdsSlice,
    ad: GetAdSlice,
    faqs: FAQSlice,
    howItWorks: HowItWorksSlice,
    aboutus: AboutSlice,
    settings: SettingsSlice,
    providerData: ProviderDataSlice,
    providerAds: ProviderAdsSlice,
    providerAdsReviews: ProviderAdsReviewsSlice,
    providerStatistics: ProviderStatisticsSlice,
    adsList: SearchSlice,
    contact: ContactSlice,
    privacyPolicy: PrivacyPolicySlice,
    termsConditions: TermsAndConditionsSlice,
    userIdentifies: UserIdentifiesSlice,
    filterServices: FilterServicesSlice,
    property: AddPropertySlice,
    properties: AllPropertiesSlice,
    plans: PlansSlice,
    subscribe: SubscribePlanSlice,
    search: SearchSlice,
  },
});

export default store;
