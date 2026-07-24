import React, { useState } from 'react';

export default function FaqAccordion({ items, className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={`faq-accordion ${className}`}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className={`faq-accordion__item${open ? ' is-open' : ''}`}>
            <button
              type="button"
              className="faq-accordion__question"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span>{item.question}</span>
              <span className="faq-accordion__icon" aria-hidden="true">{open ? '−' : '+'}</span>
            </button>
            {open && <p className="faq-accordion__answer">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
