
import { Helmet } from "react-helmet";
import Banner from "../modules/home/Banner";
import CarSession from "../modules/home/CarSession";
import FilterCar from "../modules/home/FilterCar";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CarRentalCompany",
    "name": "VivuOto Rental",
    "description": "Find and rent the perfect car for your needs. Wide selection of vehicles available for rent in Vietnam.",
    "url": "https://v-car.vercel.app/",
    "areaServed": "Vietnam",
    "priceRange": "$$"
  };
  return (
    <div>
      <Helmet>
        <title>{t("seo.HOME_PAGE_TITLE")}</title>
        <meta name="title" content={t("seo.HOME_PAGE_TITLE")} />
        <meta
          name="description"
          content={t("seo.HOME_PAGE_DESCRIPTION")}
        />
        <meta
          name="keywords"
          content={t("seo.HOME_PAGE_KEYWORD")}
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://v-car.vercel.app/" />
        <meta property="og:title" content={t("seo.HOME_PAGE_TITLE")} />
        <meta
          property="og:description"
          content="Find and rent the perfect car for your needs. Wide selection of vehicles available for rent in Vietnam."
        />
        <meta property="og:image" content="https://v-car.vercel.app/VivuOto_logo.png" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Banner></Banner>
      <FilterCar></FilterCar>
      <CarSession title="Popular" type="popular"></CarSession>
      <CarSession title="Recommendation" type="recommend"></CarSession>
    </div>
  );
};

export default HomePage;