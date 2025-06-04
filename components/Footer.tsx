// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-blue-100  shadow-md mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} SmartCanteen. Built by Rahish Sheikh.
      </div>
    </footer>
  );
}
