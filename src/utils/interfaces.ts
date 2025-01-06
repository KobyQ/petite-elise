interface IDropOff {
    name: string;
    relationToChild: string
}
export type FileOrUrl = File | string;
export interface IEnrollChild {
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
    dropChildOffSelf: boolean;
    dropOffNames?: IDropOff[];
    programs: string[];
    dayCareSchedule?: string;
    hasSibling: boolean;
    sibling?: string;
    feeding?: string;
    hasAllergies: boolean;
    allergies?: string[]
    hasSpecialHealthConditions: boolean;
    specialHealthConditions?: string[];
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