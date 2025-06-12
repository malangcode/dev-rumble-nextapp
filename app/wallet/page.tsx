"use client";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/messageContext";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";


type Transaction = {
  id: number;
  title: string;
  desc: string | null;
  amount: string;
  type: "credit" | "debit";
  created_at: string;
};

type WalletData = {
  id: number;
  userId: number;
  username: string;
  balance: number;
  transactions: Transaction[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const res = await axiosWithCsrf.get(`/api/get-wallet/?page=${page}`);
        setWalletData({
          id: res.data.id,
          userId: res.data.user_id,
          username: res.data.username,
          balance: parseFloat(res.data.balance),
          transactions: res.data.transactions,
          pagination: res.data.pagination,
        });
      } catch (err) {
        showNotification("error", "Failed to load wallet.");
        setError("Failed to fetch wallet.");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [page]);

  // Loading state
  if (loading) {
    return (
      <div className="py-3 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 shadow-md rounded-md max-w-6.5xl mx-auto">
        <div className="max-w-6.5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-3 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 shadow-md rounded-md max-w-6.5xl mx-auto">
        <div className="max-w-6.5xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading wallet: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 shadow-md rounded-md max-w-6.5xl mx-auto">
      <div className="max-w-6.5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
            My Wallet
          </h1>
          <p className="text-gray-600">
            Manage your canteen balance and transactions
          </p>
          {walletData && (
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {walletData.username}
            </p>
          )}
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available Balance</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  Rs {walletData ? walletData.balance.toFixed(2) : "0.00"}
                </h2>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Deposit Money
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Transaction History
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {walletData?.transactions.map((transaction) => {
              const isCredit = transaction.type === "credit";
              const icon = isCredit ? (
                <ArrowDownTrayIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowUpTrayIcon className="h-5 w-5 text-red-500" />
              );

              return (
                <div
                  key={transaction.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="mr-4">{icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {transaction.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {transaction.desc}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{transaction.created_at}</span>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Rs {isCredit ? "+" : "-"}
                      {parseFloat(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="p-4 border-t border-gray-200 text-center">
            {walletData?.pagination &&
              walletData.pagination.total_pages &&
              walletData.pagination.total_pages > 1 && (
                <div className="p-4 flex justify-center items-center gap-4">
                  <button
                    disabled={!walletData.pagination.has_previous}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      walletData.pagination.has_previous
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {walletData.pagination.current_page} of{" "}
                    {walletData.pagination.total_pages}
                  </span>
                  <button
                    disabled={!walletData.pagination.has_next}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      walletData && walletData.pagination.has_next
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Statements Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Monthly Statements
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">
                  June 2023 Statement
                </h4>
                <p className="text-sm text-gray-500">
                  Generated on June 1, 2023
                </p>
              </div>
              <button className="mt-2 md:mt-0 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">
                  May 2023 Statement
                </h4>
                <p className="text-sm text-gray-500">
                  Generated on May 1, 2023
                </p>
              </div>
              <button className="mt-2 md:mt-0 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
