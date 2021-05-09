import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import ProductSmokingHero from './modules/views/ProductSmokingHero';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductValues from './modules/views/ProductValues';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import ProductCTA from './modules/views/ProductCTA';
import AppAppBar from './modules/views/AppAppBar';
import Footer from '../../components/Footer/Footer'

function Index(props) {
  return (
    <React.Fragment>
      <AppAppBar {...props} />
      <ProductHero {...props} />
      {/* <ProductValues {...props} />
      <ProductCategories {...props} />
      <ProductHowItWorks {...props} />
      <ProductCTA {...props} />
      <ProductSmokingHero {...props} /> */}
      <Footer {...props} />
    </React.Fragment>
  );
}

export default withRoot(Index);
