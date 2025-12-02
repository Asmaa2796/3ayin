import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/Slices/ServicesSlice";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ServicesList = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services } = useSelector((state) => state.services);
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch, i18n.language]);
  const requestService = async (e) => {
    e.preventDefault();
     if (!token) {
      toast.warning(t("please_log_in_to_continue"));
      setTimeout(() => navigate("/login"), 1500); // redirect to login after short delay
      return;
    }
    if (!serviceId) {
      toast.warning(t("property.select_item"));
      return;
    }
    try {
      setLoading(true);
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const { data } = await axios.post(
        `https://app.xn--mgb9a0bp.com/api/order-service`,
        { service_id: serviceId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );
      if (data?.code === 200) {
        toast.success(t("messages.request_sent_successfully"));
        setTimeout(() => navigate(0), 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("messages.error_sending_request"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="request_service">
      <Breadcrumb title={t("request_service")} />
      <div className="container">
        <div className="row">
          {services && services.length > 0 && services.map((service) => (
            <div className="col-xl-3 col-lg-3 col-md-4 col-12" key={service.id}>
            <div className="card mt-3 p-4 shadow-sm">
              <h5 className="fw-bold text-md"><i className={`bi bi-caret-${i18n.language === "ar"?"left":"right"}-fill main-color text-sm`}></i> {service.name}</h5>
              <p className="line-height text-secondary text-sm">{service.desc}</p>
            </div>
          </div>
          ))}
        </div>
        <form
          className="form-style border rounded-2 my-3 p-4"
          onSubmit={requestService}
        >
          <label className="text-md fw-bold">{t("service")}</label>
          <select
            name="service_id"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">{t("property.select_item")}</option>
            {services?.length > 0 &&
              services.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          <button type="submit" className="text-sm my-3" disabled={loading}>
            {loading ? t("loading") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServicesList;