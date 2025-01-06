import { FiCheckCircle } from "react-icons/fi";
import { LuAward,  LuHeart, LuMessageSquare, LuShield, LuSparkles, LuTarget, LuUsers } from "react-icons/lu";

export const navigation: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Programs", href: "/programs" },
    { title: "Trustees", href: "/trustees" },
    { title: "Building Blocks Club", href: "/club" },
    { title: "Contact", href: "/contact" },
  ]

 export const values = [
    { 
      name: "RESPECT",
      description: "Promoting a culture of tolerance, inclusion, diversity, equality, fairness and opportunity among staff and students.",
      icon: <LuHeart className="w-8 h-8" />
    },
    { 
      name: "CLEANLINESS",
      description: "Maintaining a healthy, tidy, orderly, functional environment that enables learning and fosters good habits.",
      icon: <FiCheckCircle  className="w-8 h-8" />
    },
    { 
      name: "COMMUNICATION",
      description: "Genuine, open and honest dialogues.",
      icon: <LuMessageSquare className="w-8 h-8" />
    },
    { 
      name: "INTEGRITY",
      description: "Doing the right thing, even when no one else is watching.",
      icon: <LuShield className="w-8 h-8" />
    },
    { 
      name: "CREATIVITY",
      description: "Unearthing the potentials of both students and staff.",
      icon: <LuSparkles className="w-8 h-8" />
    },
    { 
      name: "SOLUTION & RESULT-DRIVEN",
      description: "Proactively problem-solving when issues arise.",
      icon: <LuTarget className="w-8 h-8" />
    },
    { 
      name: "ACCOUNTABILITY",
      description: "To accept responsibility and make positive changes.",
      icon: <LuUsers className="w-8 h-8" />
    },
    { 
      name: "COMMITMENT TO EXCELLENCE",
      description: "Developing skills for learning and continuously improving.",
      icon: <LuAward className="w-8 h-8" />
    },
  ]


  export const programs = [
    {
      icon: "/images/abc.png",
      title: "Daycare",
      time: "8am-3pm",
      description:
        "Enrolling babies from 3months-3years. We have 3 classes and age groups in our Daycare Block . Prewalkers, Walkers and Nursery 1. We have flexible options available as we understand babies take time to adjust. Daily, Weekly, Monthly and Termly Registration available.  In addition, our Baby & Me class meets once a month with Speechie Ad, our favorite Speechie and Language Therapist. ",
      ageGroup: "3months-3years",
      schedule: "Monday -Friday 8am -3pm",
      activities: ["Development Boosting Activities", "Rhyme Time", "Story Time", "Playtime", "Naptime "],
    },
    {
      icon: "/images/puzzle.png",
      title: "Preschool",
      time: "8am -3pm",
      price: "GHC 20,000",
      description:
        "Enrolling kids 3years -5years. There are 3 classes in our Preschool block. Nursery 2, Kindergarten 1& 2. Only Full Term registration is available for our Preschool Program. ",
      ageGroup: "Ages 3-5 years",
      schedule: "Monday -Friday 8am -3pm",
      activities: ["Early Literacy", "Math Foundations", "Creative Arts", "Science", "Gardening & Outdoor Adventures"],
    },
    {
      icon: "/images/calendar.png",
      title: "Afterschool Care",
      time: "4pm-6pm",
      price: "GHC 20,000",
      description:
        "Parents who will like to pick up their children after 4pm can register for Afterschool care. Children enrolled will be given an early dinner and engaged till they’re picked up at 6pm. ",
      ageGroup: "Ages 3months- 5years ",
      schedule: "Monday -Friday 4pm -6pm",
      activities: ["Reading", "Homework Help", "Indoor Play"],
    },
    {
      icon: "/images/feet.png",
      title: " Baby & Me",
      time: "9am- 10am",
      price: "GHC 20,000",
      description:
        "A monthly program where babies are  engaged in age appropriate activities that will help in promoting their cognitive, social, and motor skills development. This class is in collaboration with Speechie Ad, our favorite Speech and Language Therapist. We invite parents to join.",
      ageGroup: "Ages 3 months - 15 months",
      schedule: "Once a month - 9am- 10am",
      activities: ["Sensory Activities", "Music & Dance", "Storytime"],
    },
    {
      icon: "/images/playing.png",
      title: "Developmental Playgroup",
      time: "4pm-6pm",
      description:
        "A monthly program aimed at providing play-based early intervention activities with licensed experts to boost the communication, social interaction, physical and fine motor skills of young toddlers. We invite parents to join.",
      ageGroup: "Ages 16months - 35months ",
      schedule: "Once a month 9am - 10am",
      activities: ["Spatial Concepts", "Gross Motor Skills Development", "Fine Motor Skills Activities", "Joint Attention", "Physical Exercises"],
    },
    {
      icon: "/images/student.png",
      title: "Experiental Learning Activities",
      // time: "4pm-6pm",
      description:
        "We have collaborated with Vivie’s Dance Factory to have their Ballet and Taekwondo tutors , tutor our Preschoolers at our premises at a reduced cost than they would at their centre. Preschoolers may also choose Piano as well.",
      ageGroup: "Ages 3- 5 years",
      schedule: "Once a week",
      activities: ["Ballet", "Taekwondo", "Piano"],
    },
  ];
  