import * as Yup from "yup";

export const contactSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone is required"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const enrollChildSchema = Yup.object().shape({
  childName: Yup.string().required("Child Name is required"),
  childDOB: Yup.string().required("Child Date of Birth is required"),
  childAge: Yup.string().required("Child Age is required"),
  parentName: Yup.string().required("Parent Name is required"),
  parentEmail: Yup.string()
    .email("Invalid email address")
    .required("Parent Email is required"),
  parentPhoneNumber: Yup.string().required("Parent Phone Number is required"),
  parentWhatsappNumber: Yup.string().required(
    "Parent Whatsapp Number is required"
  ),
  address: Yup.string().required("Address is required"),
  emergencyContactName: Yup.string().required(
    "Emergency Contact Name is required"
  ),
  emergencyContactPhoneNumber: Yup.string().required(
    "Emergency Contact Number is required"
  ),
  emergencyContactWhatsappNumber: Yup.string().required(
    "Emergency Contact Whatsapp Number is required"
  ),
  emergencyContactRelationshipToChild: Yup.string().required(
    "Relation to child is required"
  ),
  dropChildOffSelf: Yup.boolean().required("This field is required"),
  dropOffNames: Yup.array().when("dropChildOffSelf", {
    is: (val: string) => val === "No",
    then: (schema) =>
      schema
        .required("This field is required")
        .min(2, "Exactly two drop-off names are required")
        .max(2, "Exactly two drop-off names are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  programs: Yup.array()
  .min(1, "At least one program must be selected")
  .required("Programs is required"),
  dayCareSchedule: Yup.string().when("programs", {
    is: (programs: string[]) => programs.includes("Daycare"),
    then: (schema) => schema.required("Daycare schedule is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  hasSibling: Yup.boolean().required("This field is required"),
  sibling: Yup.string().when("hasSibling", {
    is: (val: boolean) => val === true,
    then: (schema) =>
      schema
        .required("This field is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  hasAllergies: Yup.boolean().required("This field is required"),
  allergies: Yup.array().when("hasAllergies", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Please provide allergy details"),
    otherwise: (schema) => schema.notRequired(),
  }),
  hasSpecialHealthConditions: Yup.boolean().required("This field is required"),
  specialHealthConditions: Yup.array().when("hasSpecialHealthConditions", {
    is: (val: string) => val === "Yes",
    then: (schema) =>
      schema.required("Please provide health condition details"),
    otherwise: (schema) => schema.notRequired(),
  }),
  photographUsageConsent: Yup.string().required("This field is required"),

  // File upload fields with conditional validation
  // childPassport: Yup.mixed().when("programs", (programs: string[], schema) => {
  //   const optionalPrograms = ["Summer Camp", "Christmas Camp", "Childminding"];
  //   return programs.every((program) => optionalPrograms.includes(program))
  //     ? schema.notRequired()
  //     : schema
  //         .required("Child Passport is required.")
  //         .test(
  //           "fileSize",
  //           "File size is too large. Maximum size is 5MB.",
  //           (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //         );
  // }),
  // parentPassport: Yup.mixed().when("programs", (programs: string[], schema) => {
  //   const optionalPrograms = ["Summer Camp", "Christmas Camp", "Childminding"];
  //   return programs.every((program) => optionalPrograms.includes(program))
  //     ? schema.notRequired()
  //     : schema
  //         .required("Parent Passport is required.")
  //         .test(
  //           "fileSize",
  //           "File size is too large. Maximum size is 5MB.",
  //           (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //         );
  // }),
  // emergencyContactPassport: Yup.mixed().when(
  //   "programs",
  //   (programs: string[], schema) => {
  //     const optionalPrograms = [
  //       "Summer Camp",
  //       "Christmas Camp",
  //       "Childminding",
  //     ];
  //     return programs.every((program) => optionalPrograms.includes(program))
  //       ? schema.notRequired()
  //       : schema
  //           .required("Emergency Contact Passport is required.")
  //           .test(
  //             "fileSize",
  //             "File size is too large. Maximum size is 5MB.",
  //             (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //           );
  //   }
  // ),
  // pickPersonOnePassport: Yup.mixed().when(
  //   "programs",
  //   (programs: string[], schema) => {
  //     const optionalPrograms = [
  //       "Summer Camp",
  //       "Christmas Camp",
  //       "Childminding",
  //     ];
  //     return programs.every((program) => optionalPrograms.includes(program))
  //       ? schema.notRequired()
  //       : schema
  //           .required("Pick Person One Passport is required.")
  //           .test(
  //             "fileSize",
  //             "File size is too large. Maximum size is 5MB.",
  //             (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //           );
  //   }
  // ),
  // pickPersonTwoPassport: Yup.mixed().when(
  //   "programs",
  //   (programs: string[], schema) => {
  //     const optionalPrograms = [
  //       "Summer Camp",
  //       "Christmas Camp",
  //       "Childminding",
  //     ];
  //     return programs.every((program) => optionalPrograms.includes(program))
  //       ? schema.notRequired()
  //       : schema
  //           .required("Pick Person Two Passport is required.")
  //           .test(
  //             "fileSize",
  //             "File size is too large. Maximum size is 5MB.",
  //             (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //           );
  //   }
  // ),

  // G6pdReport: Yup.mixed().when("programs", (programs: string[], schema) => {
  //   const optionalPrograms = ["Summer Camp", "Christmas Camp", "Childminding"];
  //   return programs.every((program) => optionalPrograms.includes(program))
  //     ? schema.notRequired()
  //     : schema
  //         .required("G6PD Report is required.")
  //         .test(
  //           "fileSize",
  //           "File size is too large. Maximum size is 5MB.",
  //           (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //         );
  // }),

  // vaccinations: Yup.mixed().when("programs", (programs: string[], schema) => {
  //   const optionalPrograms = ["Summer Camp", "Christmas Camp", "Childminding"];
  //   return programs.every((program) => optionalPrograms.includes(program))
  //     ? schema.notRequired()
  //     : schema
  //         .required("Vaccination is required.")
  //         .test(
  //           "fileSize",
  //           "File size is too large. Maximum size is 5MB.",
  //           (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //         );
  // }),
  // childHearingTest: Yup.mixed().when(
  //   "programs",
  //   (programs: string[], schema) => {
  //     const optionalPrograms = [
  //       "Summer Camp",
  //       "Christmas Camp",
  //       "Childminding",
  //     ];
  //     return programs.every((program) => optionalPrograms.includes(program))
  //       ? schema.notRequired()
  //       : schema
  //           .required("Hearing Test is required.")
  //           .test(
  //             "fileSize",
  //             "File size is too large. Maximum size is 5MB.",
  //             (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //           );
  //   }
  // ),
  // childEyeTest: Yup.mixed().when("programs", (programs: string[], schema) => {
  //   const optionalPrograms = ["Summer Camp", "Christmas Camp", "Childminding"];
  //   return programs.every((program) => optionalPrograms.includes(program))
  //     ? schema.notRequired()
  //     : schema
  //         .required("Eye Test is required.")
  //         .test(
  //           "fileSize",
  //           "File size is too large. Maximum size is 5MB.",
  //           (value) => value instanceof File && value.size <= MAX_FILE_SIZE
  //         );
  // }),
});
