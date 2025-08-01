interface IDropOff {
    name: string;
    relationToChild: string
}
export type FileOrUrl = File | string;
export interface IEnrollChild {
    id?: string;
    childName: string;
    childDOB: string;
    childAge: string;
    parentName: string;
    parentEmail: string;
    parentPhoneNumber: string;
    parentWhatsappNumber: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhoneNumber: string;
    emergencyContactWhatsappNumber: string;
    emergencyContactRelationshipToChild: string;
    dropChildOffSelf: string;
    dropOffNames?: IDropOff[];
    programs: string[];
    dayCareSchedule?: string;
    saturdayClubSchedule?: string;
    summerCampSchedule?: string;
    christmasCampSchedule?: string;
    childMindingSchedule?: string;
    hasSibling: string;
    feeding?: string;
    hasAllergies: string;
    allergies?: string[]
    hasSpecialHealthConditions: string;
    specialHealthConditions?: string[];
    familyId?: string;
    // childPassport: FileOrUrl;
    // parentPassport: FileOrUrl;
    // emergencyContactPassport: FileOrUrl;
    // pickPersonOnePassport: FileOrUrl;
    // pickPersonTwoPassport: FileOrUrl;
    // G6pdReport: FileOrUrl;
    // vaccinations: FileOrUrl;
    // childEyeTest: FileOrUrl;
    // childHearingTest: FileOrUrl
    
    photographUsageConsent: string

}