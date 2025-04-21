import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Home() {

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">TherapySpace</h1>
            <nav>
              <Button variant="outline" className="text-black border-white hover:bg-blue-700">
                <Link href="/login">Login</Link>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section
            className="flex-1 flex items-center justify-center py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Empowering Psychologists, Connecting Patients
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Rent rooms, manage appointments, and track payments seamlessly with TherapySpace.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-600">
                    Room Rentals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Easily rent rooms for your practice with flexible scheduling and clear cancellation tracking.
                  </p>
                </CardContent>
              </Card>
              {/* Feature 2 */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-600">
                    Appointment Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Assign patients, manage bookings, and track attendance or cancellations effortlessly.
                  </p>
                </CardContent>
              </Card>
              {/* Feature 3 */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-600">
                    Payment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Monitor room fees, patient payments, and unpaid balances with precision.
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
              Ready to Simplify Your Practice?
            </h3>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/login">Join Now</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 bg-gray-800 text-white text-center">
          <p>&copy; 2025 TherapySpace. All rights reserved.</p>
        </footer>
      </div>
  );
}