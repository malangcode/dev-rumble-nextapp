'use client';

import { useState } from 'react';
import { FaWallet, FaQrcode, FaStore, FaCamera } from 'react-icons/fa';

const paymentMethods = [
  { id: 'wallet', name: 'Wallet', icon: <FaWallet className="text-lg mr-2" /> },
  { id: 'qr', name: 'QR Payment', icon: <FaQrcode className="text-lg mr-2" /> },
  { id: 'counter', name: 'On Counter', icon: <FaStore className="text-lg mr-2" /> },
];

export default function PaymentMethodSelector() {
  const [selectedMethod, setSelectedMethod] = useState<string>('wallet');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6.5xl mx-auto mt-6 bg-white shadow-md rounded-xl p-4 md:p-6">
      {/* Tabs for Small Screens */}
      <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex-shrink-0 flex items-center px-3 py-2 rounded-lg transition duration-200 text-sm ${
              selectedMethod === method.id
                ? 'bg-blue-100 text-blue-700 shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {method.icon}
            {method.name}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:flex md:flex-col gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                selectedMethod === method.id
                  ? 'bg-blue-100 text-blue-700 shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {method.icon}
              {method.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {selectedMethod === 'wallet' && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3">Pay Using Wallet</h2>
              <p className="text-gray-700 mb-1">Available Balance: <strong>Rs. 850</strong></p>
              <p className="text-gray-700">Amount to be deducted: <strong>Rs. 550</strong></p>
            </div>
          )}

          {selectedMethod === 'qr' && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3">Pay via QR Code</h2>

              {/* QR Image */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Scan the QR below:</p>
                <img
                  src="/images/qr1.jpg" // Replace dynamically
                  alt="QR Code"
                  className="w-40 h-40 shadow p-2 rounded-md"
                />
              </div>

              {/* QR Form */}
              <div className="grid gap-4">
                <div>
                  <label className="block mb-1 font-medium text-sm">Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block mb-1 font-medium text-sm">Upload Screenshot</label>
                  <div className="relative w-40 h-40 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    {screenshotPreview ? (
                      <img
                        src={screenshotPreview}
                        alt="Screenshot Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <FaCamera className="text-gray-400 text-3xl" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm">Remarks</label>
                  <input
                    type="text"
                    placeholder="Eg: rahish123 - fee payment"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'counter' && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3">Pay at the Counter</h2>
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md border border-yellow-300">
                <p className="mb-2">Please visit the office counter to make your payment.</p>
                <p>
                  <strong>Note:</strong> Tell the admin your <strong>username</strong> at the counter to get your payment approved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
