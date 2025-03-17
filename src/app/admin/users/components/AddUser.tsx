/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";

import Input from "@/components/shared/forms/Input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Form, FormikProvider, useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { addUserSchema } from "@/utils/validations";

const AddUser = ({
  isOpen,
  setIsOpen,
  setUsers
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setUsers: (val: any) => void
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
    
      try {
        const response = await fetch("/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
    
        const result = await response.json();
        if (!result.success) {
          toast.error(result.message, { position: "top-right" });
        } else {
          toast.success("User Added Successfully!", { position: "top-right" });
    
          if (result?.data?.user) {
            setUsers((prevUsers: any[] = []) => [result.data.user, ...prevUsers]);
          } else {
            toast.error("User data is missing in response!", { position: "top-right" });
          }
          
          

    
          setIsOpen(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong!", {
          position: "top-right",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: addUserSchema
    
  });
  
  const { isValid, dirty } = formik;


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-3xl  overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
      >
        <DialogTitle>Add User</DialogTitle>

        {/* Content */}
        <div className=" overflow-y-auto p-6">
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit} className="space-y-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className="w-full bg-primary text-black font-semibold py-6 text-lg relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Add User</span>
                      <span className="absolute inset-0 h-full w-0 bg-green-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </>
                  )}
                </Button>
              </motion.div>
            </Form>
          </FormikProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
