import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  DollarSign, 
  Download, 
  Eye,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Plus,
  X,
  Calendar,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Billing = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentReportModal, setShowPaymentReportModal] = useState(false);
  const [reportingInvoice, setReportingInvoice] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    // Mock payment methods - in real app these would come from API
    {
      id: 1,
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]);

  // Fetch invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery(
    ['invoices', filterStatus, searchTerm],
    () => axios.get('/api/invoices', {
      params: {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined
      }
    }).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch billing summary (client version - calculate from invoices)
  const calculateClientSummary = (invoices) => {
    if (!invoices || !Array.isArray(invoices)) return {
      totalValue: 0, 
      paidValue: 0, 
      pendingValue: 0, 
      overdueValue: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0
    };

    const summary = invoices.reduce((acc, invoice) => {
      acc.totalValue += invoice.total || 0;
      acc.totalInvoices += 1;

      if (invoice.status === 'paid') {
        acc.paidValue += invoice.total || 0;
        acc.paidInvoices += 1;
      } else if (['sent', 'draft'].includes(invoice.status)) {
        acc.pendingValue += invoice.total || 0;
        acc.pendingInvoices += 1;
      } else if (invoice.status === 'overdue') {
        acc.overdueValue += invoice.total || 0;
        acc.overdueInvoices += 1;
      }

      return acc;
    }, {
      totalValue: 0, 
      paidValue: 0, 
      pendingValue: 0, 
      overdueValue: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0
    });

    return summary;
  };

  const invoices = invoicesData?.invoices || [];
  const billingSummary = calculateClientSummary(invoices);

  const isLoading = invoicesLoading;

  const getStatusBadge = (invoice) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sent' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[invoice.status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleReportPayment = (invoice) => {
    setReportingInvoice(invoice);
    setShowPaymentReportModal(true);
  };

  // Payment report mutation
  const reportPaymentMutation = useMutation(
    ({ invoiceId, paymentData }) => axios.post(`/api/invoices/${invoiceId}/report-payment`, paymentData),
    {
      onSuccess: () => {
        toast.success('Payment report submitted! Admin has been notified and will verify the payment.');
        setShowPaymentReportModal(false);
        setReportingInvoice(null);
        queryClient.invalidateQueries(['invoices']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit payment report');
      }
    }
  );

  const handleSubmitPaymentReport = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const paymentData = {
      paymentMethod: formData.get('paymentMethod'),
      transactionId: formData.get('transactionId'),
      paymentDate: formData.get('paymentDate'),
      notes: formData.get('notes')
    };

    reportPaymentMutation.mutate({ 
      invoiceId: reportingInvoice._id, 
      paymentData 
    });
  };

  const handleDownloadInvoice = (invoiceId) => {
    // Download invoice PDF
    const link = document.createElement('a');
    link.href = `/api/invoices/${invoiceId}/download`;
    link.download = `invoice-${invoiceId}.pdf`;
    link.click();
  };

  const handlePaymentMethods = () => {
    setShowPaymentModal(true);
  };

  const handleAddPaymentMethod = (newMethod) => {
    setPaymentMethods([...paymentMethods, { 
      ...newMethod, 
      id: paymentMethods.length + 1 
    }]);
    setShowPaymentModal(false);
    toast.success('Payment method added successfully!');
  };

  const handleRemovePaymentMethod = (methodId) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
    toast.success('Payment method removed!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Billing - EpicEdge Creative"
        description="View your project invoices, payment history, and billing information."
        url="/billing"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Billing & Invoices</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your project payments and invoices</p>
          </div>
          <button 
            onClick={handlePaymentMethods}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors text-sm sm:text-base"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payment Methods</span>
            <span className="sm:hidden">Payments</span>
          </button>
        </div>

        {/* Billing Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.totalValue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Paid</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.paidValue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.pendingValue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.overdueValue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice number, project, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm font-medium placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center space-x-3 bg-white border-2 border-gray-200 p-3 rounded-xl shadow-sm">
                <Filter className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold text-gray-700">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border-2 border-amber-300 rounded-lg px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all min-w-40 cursor-pointer hover:border-amber-400"
                >
                  <option value="all">🔍 All Status</option>
                  <option value="paid">✅ Paid</option>
                  <option value="sent">📤 Sent</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="overdue">🚨 Overdue</option>
                  <option value="draft">📝 Draft</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
        </div>


        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
              <span className="text-sm text-gray-500">
                {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500 truncate max-w-32">
                            {invoice.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.project?.title || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.project?.category || ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${invoice.total?.toLocaleString() || '0'}
                        </div>
                        {invoice.taxAmount > 0 && (
                          <div className="text-xs text-gray-500">
                            +${invoice.taxAmount.toLocaleString()} tax
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(invoice)}
                          {['sent', 'overdue'].includes(invoice.status) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Can Report Payment
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-amber-600 hover:text-amber-900 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(invoice._id)}
                            className="text-amber-600 hover:text-amber-900 flex items-center"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                          {['sent', 'overdue'].includes(invoice.status) && (
                            <button 
                              onClick={() => handleReportPayment(invoice)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              Report Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-700">No invoices found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'No invoices match your current filters.' 
                          : 'Your invoices will appear here when available.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Method
              </button>
            </div>
          </div>
          <div className="p-6">
            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {method.brand} ending in {method.last4}
                          </span>
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                          Set as Default
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-700">No payment methods</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a payment method to streamline future transactions.
                </p>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Report Modal */}
        {showPaymentReportModal && reportingInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Report Payment</h3>
                <button 
                  onClick={() => setShowPaymentReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Invoice: #{reportingInvoice.invoiceNumber}</h4>
                <p className="text-sm text-green-700">Amount: <strong>${reportingInvoice.total?.toLocaleString()}</strong></p>
                <p className="text-sm text-green-700">Project: <strong>{reportingInvoice.project?.title || 'N/A'}</strong></p>
              </div>

              <form onSubmit={handleSubmitPaymentReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="mobile_money">Mobile Money (M-Pesa, etc.)</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    placeholder="Enter transaction ID or reference number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="Any additional details about the payment..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  ></textarea>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Submitting this form will notify the admin to verify your payment. 
                    Once verified, your invoice status will be updated to "Paid" and you'll receive a confirmation email.
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentReportModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportPaymentMutation.isLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {reportPaymentMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Submit Payment Report'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Detail Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Invoice Details</h3>
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Header */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">#{selectedInvoice.invoiceNumber}</h2>
                        <p className="text-amber-100 mt-1">EpicEdge Creative</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                          <span className="text-sm font-medium">
                            {getStatusBadge(selectedInvoice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-gray-600">{user?.email}</p>
                          <p className="text-gray-600">{user?.company || 'Individual Client'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Invoice Info</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Issue Date:</span>
                            <span className="font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Project:</span>
                            <span className="font-medium">{selectedInvoice.project?.title || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">{selectedInvoice.description}</p>
                      </div>
                    </div>

                    {/* Items */}
                    {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Items</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedInvoice.items.map((item, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                  <td className="px-4 py-3 text-gray-900">{item.description}</td>
                                  <td className="px-4 py-3 text-right text-gray-900">{item.quantity || 1}</td>
                                  <td className="px-4 py-3 text-right text-gray-900">${(item.rate || 0).toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right font-semibold text-gray-900">${(item.amount || 0).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedInvoice.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900">{selectedInvoice.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${(selectedInvoice.subtotal || 0).toLocaleString()}</span>
                      </div>
                      
                      {selectedInvoice.taxRate > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax ({selectedInvoice.taxRate}%):</span>
                          <span className="font-medium">${(selectedInvoice.taxAmount || 0).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-gray-900">Total:</span>
                          <span className="font-bold text-gray-900">${(selectedInvoice.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {selectedInvoice.status === 'paid' && selectedInvoice.paymentDate && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">Paid</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Payment received on {new Date(selectedInvoice.paymentDate).toLocaleDateString()}
                        </p>
                        {selectedInvoice.paymentMethod && (
                          <p className="text-xs text-green-600 mt-1">
                            Method: {selectedInvoice.paymentMethod.replace('_', ' ').toUpperCase()}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedInvoice.status === 'sent' && (
                      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-amber-600 mr-2" />
                          <span className="text-sm font-medium text-amber-800">Payment Pending</span>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                          Please make payment by {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => handleDownloadInvoice(selectedInvoice._id)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>

                      {selectedInvoice.status === 'sent' && (
                        <div className="text-center pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-3">Made a payment?</p>
                          <button
                            onClick={() => {
                              setShowInvoiceModal(false);
                              handleReportPayment(selectedInvoice);
                            }}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-3"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Report Payment
                          </button>
                          <p className="text-xs text-gray-500">
                            Or contact us at <strong>epicedgecreative@gmail.com</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Add Payment Method</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newMethod = {
                  type: 'credit_card',
                  last4: formData.get('cardNumber').slice(-4),
                  brand: 'Visa', // In real app, detect from card number
                  expiryMonth: parseInt(formData.get('expiryMonth')),
                  expiryYear: parseInt(formData.get('expiryYear')),
                  isDefault: paymentMethods.length === 0
                };
                handleAddPaymentMethod(newMethod);
              }} className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                    <CreditCard className="w-4 h-4 mr-2 text-amber-600" />
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                      Expiry Month *
                    </label>
                    <select
                      name="expiryMonth"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm cursor-pointer"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')} - {new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                      Expiry Year *
                    </label>
                    <select
                      name="expiryYear"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm cursor-pointer"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({length: 10}, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <option key={year} value={year}>{year}</option>
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Building className="w-4 h-4 mr-2 text-amber-600" />
                      Billing ZIP
                    </label>
                    <input
                      type="text"
                      name="billingZip"
                      placeholder="12345"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="John Doe"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-colors font-bold text-sm shadow-lg hover:shadow-xl"
                  >
                    💳 Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Billing;
