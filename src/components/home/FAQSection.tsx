import { FAQItem } from './FAQItem'

const faqs = [
  {
    question: "What age groups do you cater to?",
    answer: "We welcome children from 3months -5 years old in our daycare and preschool program. Our activities and care are tailored to meet the developmental needs of each age group."
  },
  {
    question: "What are your operating hours?",
    answer: "Our daycare and preschool is open from 8:00 AM -3:00 PM but drop off can start from 7:30 AM-  to as late as 6:00 PM if registered for our after school program."
  },
  {
    question: "What is your staff-to-child ratio?",
    answer: "We maintain a low staff-to-child ratio to ensure each child receives enough attention. 3months-15 months 1:4 ratio, 16months- 3years 1:5 ratio, 3 -5 years 8:1 ratio"
  },
  {
    question: "Do you provide meals and snacks?",
    answer: "Yes, we provide nutritious meals- breakfast , lunch and a fruit snack that are prepared fresh daily by Aunty Naana’s kitchen. We accommodate dietary restrictions and allergies. Our menu is designed to ensure balanced and child-friendly options."
  },
  {
    question: "What is your approach to early childhood education?",
    answer: "We follow a play-based learning approach that encourages curiosity, creativity, and social skills. Our Early Years Foundation Stage ( EYFS) Framework includes  activities that promote cognitive, physical, and emotional development, preparing children for future academic success."
  }
]

export function FAQSection() {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

