import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TherapySpace</h1>
          <nav>
            <Button variant="outline" className="text-black border-white hover:bg-blue-700">
              <Link href="/login">Giriş Yap</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="flex-1 flex items-center justify-center py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Psikologları Güçlendiriyor, Hastaları Buluşturuyoruz
          </h2>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            TherapySpace ile odaları kiralayın, randevuları yönetin ve ödemeleri sorunsuz bir şekilde takip edin.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/login">Başlayın</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Neden Bizi Tercih Etmelisiniz?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Özellik 1 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Oda Kiralama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Esnek zamanlama ve net iptal takibi ile uygulamanız için kolayca oda kiralayın.
                </p>
              </CardContent>
            </Card>
            {/* Özellik 2 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Randevu Yönetimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hastaları atayın, rezervasyonları yönetin ve katılım veya iptalleri zahmetsizce takip edin.
                </p>
              </CardContent>
            </Card>
            {/* Özellik 3 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Ödeme Takibi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oda ücretlerini, hasta ödemelerini ve ödenmemiş bakiyeleri hassasiyetle izleyin.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Uygulamanızı Kolaylaştırmaya Hazır mısınız?
          </h3>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/login">Hemen Katılın</Link>
          </Button>
        </div>
      </section>

      {/* Alt Bilgi (Footer) */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 TherapySpace. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}