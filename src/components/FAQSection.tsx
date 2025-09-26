'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Par où commencer pour acheter une maison ?",
    answer: "Commencez par définir votre budget et vos objectifs d'investissement. Ensuite, explorez les différents quartiers de Dubaï pour identifier ceux qui correspondent à vos critères. Nous vous accompagnons dès cette première étape avec une consultation personnalisée gratuite pour établir votre stratégie d'investissement."
  },
  {
    question: "Quels sont les avantages d'investir dans l'immobilier à Dubaï ?",
    answer: "Dubaï offre des rendements locatifs élevés, pas d'impôt sur le revenu, une économie stable et en croissance, ainsi qu'une qualité de vie exceptionnelle. Le marché immobilier est régulé et transparent, offrant une sécurité juridique aux investisseurs internationaux."
  },
  {
    question: "Comment financer mon investissement immobilier à Dubaï ?",
    answer: "Plusieurs options de financement sont disponibles : prêts bancaires locaux avec des taux compétitifs, financement développeur avec plans de paiement flexibles, ou investissement au comptant. Nous vous accompagnons dans le choix de la meilleure solution selon votre profil."
  },
  {
    question: "Quelle est la procédure d'achat pour un étranger ?",
    answer: "Les étrangers peuvent acheter en pleine propriété dans les zones désignées. La procédure comprend : signature du contrat de vente, versement d'un acompte, enregistrement auprès du Dubai Land Department, et obtention du titre de propriété. Nous gérons l'ensemble du processus pour vous."
  },
  {
    question: "Quels sont les frais associés à l'achat ?",
    answer: "Les frais incluent : 4% de frais de transfert au DLD, environ 2% de frais d'agence, frais administratifs (environ 5,000 AED), et frais de prêt si financement bancaire (environ 1% du montant emprunté). Nous vous fournirons un décompte détaillé avant tout engagement."
  },
  {
    question: "Comment gérer mon bien à distance ?",
    answer: "Nous proposons des services complets de gestion locative : recherche de locataires, contrats de location, collecte des loyers, maintenance, et rapports réguliers. Vous pouvez investir en toute sérénité sans être présent à Dubaï."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h2
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '32px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
          className="mb-12"
        >
          Foire aux questions
        </h2>

        <div className="space-y-4">
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
                <span
                  className="font-light"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '24px'
                  }}
                >
                  {openIndex === index ? '−' : '+'}
                </span>
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