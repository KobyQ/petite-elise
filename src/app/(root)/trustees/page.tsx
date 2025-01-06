import CTA from "@/components/programs/CTA";
import TrusteeCard from "@/components/trustees/TrusteeCard";

interface Trustee {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const trustees: Trustee[] = [
  {
    id: 1,
    name: "Mrs. Eno Quagraine",
    role: "Board Member",
    bio: `Mrs. Eno Quagraine is a passionate educator with her first teaching experience 16 years ago at Ghana International School where she honed her skills in nurturing young minds. She also provided private tutoring for kids who struggled academically and volunteered at Alkot Child Development Centre as a caregiver for orphaned babies. 
With a deep commitment to maternal health, she founded Talkative Mom LLC, a platform she created to empower and support mothers through advocacy and community building. 

As a dedicated mother herself, Eno is passionate about creating environments where children can thrive. She is excited to bring her expertise, leadership, and care to the role of school head.


`,
    image: "/images/eno-trustee.jpg",
  },
  {
    id: 2,
    name: "Mrs. Surama King",
    role: "Board Member",
    bio: `With over 25 years as an experiential and service-learning educator, Surama’s career spans various educational settings, where she has championed holistic, co-curricular engagement as a means of inspiring lifelong learning. She is passionate about guiding students toward personal and academic growth by fostering creativity, resilience, and community engagement through experiential learning. As a strong advocate for service and real-world learning, Surama brings deep insight into the impact of co-curricular activities in shaping well-rounded, globally minded individuals. She is currently the head of CAS ( Creativity , Activity, Service) Coordinator at Tema International School and looks forward to replicating her work here and speaking creativity  in our young ones. 

`,
    image: "/images/King.jpg",
  },
  {
    id: 3,
    name: "Dr Genevieve Allotey-Pappoe",
    role: "Board Member",
    bio: `Dr Genevieve Allotey- Pappoe is an Assistant Professor of Musicology and Ethnomusicology at Brown University. She completed her PhD in the Department of Music at Princeton University with a focus on music of the Black diaspora, African creative economy, sound studies, media studies, and the music industry. 
Genevieve is a composer and her compositions have been performed in USA, Greece, Ghana, and Nigeria.
She is passionate about bridging the gap between academia and the creative sector through collaborative projects that focus on music, technology, communities, and social impact and is excited to see the musical talents in our little ones and provide guidance on international opportunities. 
 
`,
    image: "/images/Genevive.jpg",
  },
  {
    id: 4,
    name: "Mr. David Quagraine",
    role: "Board Member",
    bio: `Mr. David Quagraine is a seasoned Cloud Consultant and Solutions Architect with over 12 years of experience delivering secure, cost-effective solutions across finance, telecommunications, and technology sectors. He specializes in Solution Architecture, DevSecOps, and FinOps, with a proven track record of leading high-impact projects that drive innovation and efficiency. David holds an MSc in Business Technology Consulting from Henley Business School.  A passionate educator, David has previously lectured technology students and values the power of education in shaping future leaders in the tech space. Currently, as the Head of Cloud Architecture at a prominent financial institution, David leads teams in designing cutting-edge cloud strategies and solutions. Beyond his technical career, David is committed to empowering the next generation by developing tech-based programs that introduce young children to the possibilities of emerging technologies, ensuring they are prepared for tomorrow's digital world.

`,
    image: "/images/David.jpg",
  },
  {
    id: 5,
    name: "Mrs . Adelaide Yirenkyi",
    role: "Board Member",
    bio: `Mrs . Adelaide Yirenkyi is a clinical educator at the Department of Audiology, Speech and Language Therapy at the University of Ghana. She has a bachelor's degree in Psychology and a master's in Speech and Language Therapy. Adelaide has always been interested in special needs and has been working in inclusive education since 2012. Adelaide is an Early Interventionist and currently serves children and their families across Ghana and West Africa through the Speech and Hearing Centre and looks forward to building a more inclusive environment while heading programs that focus on early intervention. 
 
`,
    image: "/images/Adelaide.jpg",
  },

];

export default function BoardOfTrustees() {
  return (
  <>
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-20 text-center">
        <h2 className="text-2xl lg:text-5xl font-bold text-gray-800 mb-12">Meet the School Board.
        </h2>
        <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Our trustees are leaders who bring expertise from diverse fields, guiding us toward excellence and empowering future generations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {trustees.map((trustee) => (
        <TrusteeCard key={trustee?.name} trustee={trustee} />
          ))}
        </div>
      </div>
    </section>
    <CTA />
  </>
  );
}
