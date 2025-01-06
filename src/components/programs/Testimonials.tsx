import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent } from "../ui/card"

const testimonials = [
  {
    quote: "Your daycare has been amazing. You've created and provided a loving stimulating environment where Kuuku is thriving. Thank you",
    author: "Ohui A. K.",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "Love how the school is looking already! I see something new almost everyday during drop offs and pick ups and I always can’t help but to take photos. I’m already excited for my girl. You guys are really doing a great job",
    author: "Naaku A. ",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "After bringing my girls here, I’m finally starting to feel like myself again.",
    author: "Vida K.",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "I’m always excited to see what’s new during pick up! Love the new space",
    author: "Emily F.",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "At church, I notice my son is meeting his milestones earlier than his age mates because he started Daycare",
    author: "Joel B. A",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-primary">What Parents Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <CardContent className="pt-6 pb-8 px-6">
                <blockquote className="text-lg italic mb-6 text-gray-700">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-14 w-14 mr-6 border-2 border-[#007f94]">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback className="text-lg font-semibold text-primary">
                      {testimonial.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
