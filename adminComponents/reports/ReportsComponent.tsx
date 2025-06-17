import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, Mail, Calendar, Filter, FileText, Users, TrendingUp, DollarSign, Clock, Send, Eye, CheckCircle, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedReport, setSelectedReport] = useState('sales');
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Dummy data for different report types
  const salesReportData = {
    daily: [
      { date: '2025-06-01', sales: 12500, orders: 45, avgOrder: 278 },
      { date: '2025-06-02', sales: 15800, orders: 52, avgOrder: 304 },
      { date: '2025-06-03', sales: 11200, orders: 38, avgOrder: 295 },
      { date: '2025-06-04', sales: 18900, orders: 67, avgOrder: 282 },
      { date: '2025-06-05', sales: 22100, orders: 78, avgOrder: 283 },
      { date: '2025-06-06', sales: 19500, orders: 65, avgOrder: 300 },
      { date: '2025-06-07', sales: 16800, orders: 59, avgOrder: 285 }
    ],
    weekly: [
      { week: 'Week 1', sales: 145000, orders: 520, efficiency: 85 },
      { week: 'Week 2', sales: 158000, orders: 580, efficiency: 88 },
      { week: 'Week 3', sales: 142000, orders: 495, efficiency: 82 },
      { week: 'Week 4', sales: 167000, orders: 625, efficiency: 90 }
    ],
    monthly: [
      { month: 'January', sales: 580000, orders: 2100, growth: 12 },
      { month: 'February', sales: 625000, orders: 2250, growth: 8 },
      { month: 'March', sales: 698000, orders: 2480, growth: 12 },
      { month: 'April', sales: 715000, orders: 2520, growth: 2 },
      { month: 'May', sales: 742000, orders: 2680, growth: 4 },
      { month: 'June', sales: 612000, orders: 2220, growth: -18 }
    ]
  };

  const expenseData = [
    { category: 'Ingredients', amount: 45000, percentage: 35 },
    { category: 'Staff Salary', amount: 38000, percentage: 30 },
    { category: 'Utilities', amount: 15000, percentage: 12 },
    { category: 'Equipment', amount: 12000, percentage: 9 },
    { category: 'Maintenance', amount: 8000, percentage: 6 },
    { category: 'Others', amount: 10000, percentage: 8 }
  ];

  const inventoryData = [
    { item: 'Rice', used: 120, wasted: 5, efficiency: 96 },
    { item: 'Dal', used: 80, wasted: 3, efficiency: 96 },
    { item: 'Vegetables', used: 95, wasted: 12, efficiency: 89 },
    { item: 'Chicken', used: 60, wasted: 2, efficiency: 97 },
    { item: 'Spices', used: 25, wasted: 1, efficiency: 96 }
  ];

  const reportHistory = [
    {
      id: 'RPT-2025-001',
      type: 'Sales Report',
      period: 'Weekly',
      dateRange: 'Jun 8-14, 2025',
      generatedOn: '2025-06-15 09:30',
      status: 'Sent',
      recipients: ['manager@canteen.com', 'admin@canteen.com'],
      size: '2.4 MB'
    },
    {
      id: 'RPT-2025-002',
      type: 'Inventory Report',
      period: 'Daily',
      dateRange: 'Jun 14, 2025',
      generatedOn: '2025-06-15 08:00',
      status: 'Generated',
      recipients: ['inventory@canteen.com'],
      size: '1.8 MB'
    },
    {
      id: 'RPT-2025-003',
      type: 'Staff Performance',
      period: 'Monthly',
      dateRange: 'May 2025',
      generatedOn: '2025-06-01 10:15',
      status: 'Sent',
      recipients: ['hr@canteen.com', 'manager@canteen.com'],
      size: '3.2 MB'
    },
    {
      id: 'RPT-2025-004',
      type: 'Financial Summary',
      period: 'Weekly',
      dateRange: 'Jun 1-7, 2025',
      generatedOn: '2025-06-08 09:45',
      status: 'Downloaded',
      recipients: ['accounts@canteen.com'],
      size: '2.1 MB'
    }
  ];

  const roleBasedEmails = {
    manager: ['manager@canteen.com', 'supervisor@canteen.com'],
    admin: ['admin@canteen.com', 'system@canteen.com'],
    cashier: ['cashier1@canteen.com', 'cashier2@canteen.com'],
    inventory: ['inventory@canteen.com', 'stock@canteen.com'],
    accounts: ['accounts@canteen.com', 'finance@canteen.com']
  };

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'inventory', name: 'Inventory Report', icon: <FileText className="h-4 w-4" /> },
    { id: 'staff', name: 'Staff Performance', icon: <Users className="h-4 w-4" /> },
    { id: 'expenses', name: 'Expense Report', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    console.log(`Downloading report: ${reportId}`);
    // In real implementation, this would trigger actual file download
    alert(`Downloading report ${reportId}...`);
  };

  const handleSendEmail = (reportId: string, recipients: string | any[]) => {
    // Simulate email sending
    console.log(`Sending report ${reportId} to:`, recipients);
    alert(`Email sent successfully to ${recipients.length} recipients!`);
    setShowEmailModal(false);
  };

  const EmailModal = () => (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Send Report via Email</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-lg">
            <option>Weekly Sales Report</option>
            <option>Daily Inventory Report</option>
            <option>Monthly Staff Performance</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients by Role
          </label>
          <div className="space-y-2">
            {Object.entries(roleBasedEmails).map(([role, emails]) => (
              <label key={role} className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked={role === 'manager'} />
                <span className="capitalize">{role}</span>
                <span className="text-sm text-gray-500 ml-2">({emails.length} emails)</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-lg">
            <option>Send Now</option>
            <option>Schedule for Tomorrow 9:00 AM</option>
            <option>Weekly - Every Monday</option>
            <option>Monthly - 1st of every month</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowEmailModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSendEmail('RPT-2025-NEW', ['manager@canteen.com'])}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Generate, analyze and distribute canteen reports automatically
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Report
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Generate New
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-1" />
                Report Type
              </label>
              <select 
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Time Period
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue="2025-06-15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare With
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Previous Period</option>
                <option>Same Period Last Year</option>
                <option>No Comparison</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Sales Trend - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesReportData[selectedPeriod as keyof typeof salesReportData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={selectedPeriod === 'daily' ? 'date' : selectedPeriod === 'weekly' ? 'week' : 'month'} stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Efficiency & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inventory Efficiency */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Inventory Efficiency</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="item" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="used" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wasted" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Performance Metrics</h3>
            <div className="space-y-4">
              {[
                { metric: 'Average Daily Revenue', value: 'Rs. 18,500', change: '+12.5%', trend: 'up' },
                { metric: 'Food Cost Percentage', value: '32%', change: '-2.1%', trend: 'down' },
                { metric: 'Customer Satisfaction', value: '4.6/5', change: '+0.3', trend: 'up' },
                { metric: 'Inventory Turnover', value: '12.5x', change: '+1.2x', trend: 'up' },
                { metric: 'Staff Productivity', value: '89%', change: '+5%', trend: 'up' },
                { metric: 'Waste Percentage', value: '4.2%', change: '-1.1%', trend: 'down' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{item.metric}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                  <div className={`text-right ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`h-4 w-4 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                    <p className="text-sm font-medium">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Report History</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last updated: 2 minutes ago</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Report ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Period</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date Range</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Generated On</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.map((report, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-blue-600">{report.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{report.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{report.period}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{report.dateRange}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{report.generatedOn}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Sent' ? 'bg-green-100 text-green-800' :
                        report.status === 'Generated' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status === 'Sent' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                        {report.status === 'Generated' && <AlertCircle className="h-3 w-3 inline mr-1" />}
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{report.size}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReport(report.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setShowEmailModal(true)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="Send via Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Recipients Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {Object.entries(roleBasedEmails).map(([role, emails]) => (
            <div key={role} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900 capitalize">{role}</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
              <p className="text-sm text-gray-600">Recipients</p>
              <div className="mt-2 text-xs text-gray-500">
                {emails.slice(0, 1).map(email => (
                  <div key={email}>{email}</div>
                ))}
                {emails.length > 1 && <div>+{emails.length - 1} more</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && <EmailModal />}
    </div>
  );
};

export default Reports;