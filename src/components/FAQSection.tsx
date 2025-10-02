'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Comment démarrer un achat immobilier à Dubaï ?",
    answer: "Commencez par définir votre budget et obtenir, si besoin, une pré-approbation bancaire. Nous vous aidons à cibler les quartiers, organiser les visites (physiques ou virtuelles), puis à formaliser l’offre (MOU), réaliser la due diligence, obtenir le NOC et finaliser le transfert chez un trustee de la DLD."
  },
  {
    question: "Un étranger peut-il acheter en pleine propriété (freehold) ?",
    answer: "Oui, dans de nombreuses zones freehold désignées par l’Emirat. Nous vous orientons vers les secteurs adaptés à votre projet (résidentiel, investissement, villégiature) et vérifions pour vous le statut foncier et les règles de copropriété."
  },
  {
    question: "Quels frais prévoir en plus du prix d’achat ?",
    answer: "Au-delà du prix du bien, anticipez : frais d’enregistrement à la DLD, éventuelle taxe Oqood pour l’off-plan, commission d’agence, charges de copropriété (service charges), raccordements/évaluations, et, en cas de financement, frais bancaires/assurance. Nous vous remettons un budget prévisionnel détaillé avant toute décision."
  },
  {
    question: "Quelle stratégie locative et quel rendement viser ?",
    answer: "À Dubaï, la location classique et la location meublée à court ou moyen terme coexistent. Le rendement dépend du quartier, du type de bien et de la gestion. Nous modélisons votre cash-flow (loyers nets des charges) et proposons un service de gestion locative pour sécuriser l’occupation et la performance."
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-[87px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-64">
        {/* Left side - Heading and subheading */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-h2 text-mont-medium mb-6">
            Questions fréquentes
          </h2>
          <p className="text-body-lg text-mont-regular text-gray-600 leading-relaxed">
            Pour vous aider à décider avec clarté, nous répondons aux questions que l'on nous pose le plus souvent.
          </p>
        </div>

        {/* Right side - FAQs */}
        <div className="space-y-4 lg:col-span-2">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full text-left flex justify-between items-center py-4 hover:text-gray-700 transition-colors"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '24px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                <span>{item.question}</span>
                <div className="flex-shrink-0 ml-4">
                  <Image
                    src={openIndex === index ? "/top-right-arrow.svg" : "/bottom-right-arrow.svg"}
                    alt=""
                    width={24}
                    height={24}
                    className="transition-all duration-200"
                  />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="py-4 text-gray-600"
                      style={{
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontWeight: 300,
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}
                    >
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}