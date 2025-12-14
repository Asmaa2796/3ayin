import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tilt from 'react-parallax-tilt';
import { useTranslation } from 'react-i18next';
import './Services.css';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t, i18n } = useTranslation('global');
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(`https://app.xn--mgb9a0bp.com/api/categories/sub-categories`,{
            headers:{
                "Lang":i18n.language
            }
        });
        const categories = res?.data?.data || [];
        const serviceCategory = categories.find((cat) => cat.id === 16);

        if (serviceCategory) {
          setSubCategories(serviceCategory.sub_categories);
        }
      } catch (error) {
      }
    };

    fetchSubCategories();
  }, [i18n.language]);

  return (
    <div className='services py-5'>
      <div className='container'>
        <h3 className='text-center mb-5 fw-bold main-color'>{t("services.title")}</h3>
        <ul className='service_btns text-center d-flex flex-wrap justify-content-center'>
          {subCategories.map((sub, index) => (
            <Tilt
              key={sub.id || index}
              glareEnable={true}
              glareMaxOpacity={0.9}
              glareColor="#fdfdfd"
              glarePosition="all"
              glareBorderRadius="20px"
              className="tilt-button"
            >
              <button>
                <img
                    src={sub.image || "/placeholder.jpg"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                    alt="--"
                  />
                <span>{sub.name}</span>
              </button>
            </Tilt>
          ))}
        </ul>
         <div className='text-center'>
          <Link
              to="/request_service"
              className="rounded-5 shadow-sm bg-dark text-white text-sm px-3 request_service_btn"
              style={{ paddingBlock: "6px" }}
            >
              <i className="bi bi-pen text-xs fw-bold mt-1 mx-1"></i>{" "}
              <span>{t("request_service")}</span>
            </Link>
         </div>
      </div>
    </div>
  );
};

export default Services;
