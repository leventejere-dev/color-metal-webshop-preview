import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ToastProvider } from '@/context/ToastContext';
import { BareLayout, Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/Home';
import { ProductsPage } from '@/pages/Products';
import { AluShopPage } from '@/pages/AluShop';
import { ProductDetailPage } from '@/pages/ProductDetail';
import { ConfiguratorPage } from '@/pages/Configurator';
import { CartPage } from '@/pages/Cart';
import { CheckoutPage } from '@/pages/Checkout';
import { OrderConfirmationPage } from '@/pages/OrderConfirmation';
import { DocumentPage } from '@/pages/Document';
import { LoginPage, RegisterPage } from '@/pages/Auth';
import { AccountLayout } from '@/pages/account/AccountLayout';
import { AccountOverviewPage, ChangePasswordPage, ContactDataPage, DeliveryAddressPage, InvoicesPage, OrdersPage, SettingsPage } from '@/pages/account/AccountPages';
import { FavoritesList, FavoritesPage } from '@/pages/Favorites';
import { AboutPage } from '@/pages/About';
import { ContactPage } from '@/pages/Contact';
import { PrivacyPage, ReturnsPage, TermsPage } from '@/pages/Legal';
import { NotFoundPage, SearchPage } from '@/pages/Search';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="produse" element={<ProductsPage />} />
                  <Route path="alushop" element={<AluShopPage />} />
                  <Route path="produse/:slug" element={<ProductDetailPage />} />
                  <Route path="configurator/:slug/:material" element={<ConfiguratorPage />} />
                  <Route path="cautare" element={<SearchPage />} />
                  <Route path="cos" element={<CartPage />} />
                  <Route path="finalizare-comanda" element={<CheckoutPage />} />
                  <Route path="comanda/:id" element={<OrderConfirmationPage />} />
                  <Route path="autentificare" element={<LoginPage />} />
                  <Route path="inregistrare" element={<RegisterPage />} />
                  <Route path="favorite" element={<FavoritesPage />} />
                  <Route path="cont" element={<AccountLayout />}>
                    <Route index element={<AccountOverviewPage />} />
                    <Route path="comenzi" element={<OrdersPage />} />
                    <Route path="facturi" element={<InvoicesPage />} />
                    <Route path="favorite" element={<FavoritesList embedded />} />
                    <Route path="date-contact" element={<ContactDataPage />} />
                    <Route path="adresa-livrare" element={<DeliveryAddressPage />} />
                    <Route path="setari" element={<SettingsPage />} />
                    <Route path="schimbare-parola" element={<ChangePasswordPage />} />
                  </Route>
                  <Route path="despre-noi" element={<AboutPage />} />
                  <Route path="cariere" element={<Navigate to="/contact" replace />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="termeni-si-conditii" element={<TermsPage />} />
                  <Route path="politica-de-confidentialitate" element={<PrivacyPage />} />
                  <Route path="politica-de-retur" element={<ReturnsPage />} />
                  {/* rute vechi din webshopul actual → echivalentele noi */}
                  <Route path="forme" element={<Navigate to="/produse" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route element={<BareLayout />}>
                  <Route path="proforma/:id" element={<DocumentPage kind="proforma" />} />
                  <Route path="factura/:id" element={<DocumentPage kind="factura" />} />
                </Route>
              </Routes>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
