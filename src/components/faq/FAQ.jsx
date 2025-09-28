import React, { useState, useEffect } from "react";
import "./faq.css";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchFaqs } from "../../redux/Slices/FAQSlice";
import { useDispatch, useSelector } from "react-redux";
import FaqLoader from "../../pages/FaqLoader";

const FAQ = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { isLoading, faqs } = useSelector((state) => state.faqs);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch,i18n,t]);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.faq")} />
      <div className="faq py-5 my-3 position-relative">
        <div className="container">
          {isLoading ? (
            <FaqLoader />
          ) : faqs && faqs.length >= 1 ? (
            <div className="accordion" id="accordionExample">
              {faqs.map((faq, index) => (
                <div className="accordion-item" key={faq.id}>
                  <h2 className="accordion-header" id={`heading${faq.id}`}>
                    <button
                      className={`accordion-button ${activeIndex !== index ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => handleToggle(index)}
                      aria-expanded={activeIndex === index}
                      aria-controls={`collapse${faq.id}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${faq.id}`}
                    className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
                    aria-labelledby={`heading${faq.id}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body text-secondary text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
              <h5 className="mb-0">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
