import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Calendar,
  FileText,
  Download,
  Trash2
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminBilling = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch all invoices (admin view)
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery(
    ['admin-invoices', searchTerm, filterStatus],
    () => axios.get('/api/invoices', {
      params: {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      }
    }).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch projects for invoice creation
  const { data: projectsData } = useQuery(
    'admin-projects-for-billing',
    () => axios.get('/api/projects').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch billing summary
  const { data: summaryData, isLoading: summaryLoading } = useQuery(
    'admin-invoices-summary',
    () => axios.get('/api/invoices/summary').then(res => res.data.data.summary),
    {
      refetchOnWindowFocus: false,
    }
  );

  const invoices = invoicesData?.invoices || [];
  const projects = projectsData || [];
  const billingSummary = summaryData || { 
    totalValue: 0, 
    paidValue: 0, 
    pendingValue: 0, 
    overdueValue: 0 
  };

  // Create invoice mutation
  const createInvoiceMutation = useMutation(
    (invoiceData) => axios.post('/api/invoices', invoiceData),
    {
      onSuccess: () => {
        toast.success('Invoice created and email notification sent!');
        setShowCreateModal(false);
        queryClient.invalidateQueries(['admin-invoices']);
        queryClient.invalidateQueries('admin-invoices-summary');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create invoice');
      }
    }
  );

  // Update invoice status mutation
  const updateStatusMutation = useMutation(
    ({ invoiceId, status, paymentMethod }) => 
      axios.put(`/api/invoices/${invoiceId}/status`, { status, paymentMethod }),
    {
      onSuccess: (response) => {
        const message = response.data.message || 'Invoice status updated successfully';
        toast.success(message);
        queryClient.invalidateQueries(['admin-invoices']);
        queryClient.invalidateQueries('admin-invoices-summary');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update invoice status');
      }
    }
  );

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const invoiceData = {
      projectId: formData.get('projectId'),
      amount: parseFloat(formData.get('amount')),
      dueDate: formData.get('dueDate'),
      description: formData.get('description'),
      taxRate: parseFloat(formData.get('taxRate')) || 0,
      notes: formData.get('notes')
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    console.log('Status change requested:', { invoiceId, newStatus });
    let paymentMethod = null;
    if (newStatus === 'paid') {
      paymentMethod = prompt('Payment method (bank_transfer, credit_card, paypal, check, other):') || 'other';
    }
    updateStatusMutation.mutate({ invoiceId, status: newStatus, paymentMethod });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sent' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (invoicesLoading || summaryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Admin Billing - EpicEdge Creative"
        description="Manage invoices, billing, and payments for all clients."
        url="/admin-billing"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Billing Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Create and manage client invoices</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        {/* Summary Cards */}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.totalValue?.toLocaleString() || '0'}
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
                    ${billingSummary.paidValue?.toLocaleString() || '0'}
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
                    ${billingSummary.pendingValue?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${billingSummary.overdueValue?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              
              <div className="flex items-center space-x-3 bg-white border-2 border-gray-200 p-3 rounded-xl">
                <Filter className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold text-gray-700">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border-2 border-amber-300 rounded-lg px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Invoices</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
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
                            {invoice.client?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.client?.email || ''}
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
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {/* Debug info - remove after testing */}
                          {console.log('Invoice status:', invoice.status, 'Invoice ID:', invoice._id)}
                          
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(invoice._id, 'sent')}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                              title="Send Invoice"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </button>
                          )}
                          {invoice.status === 'sent' && (
                            <button
                              onClick={() => handleStatusChange(invoice._id, 'paid')}
                              className="inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Paid
                            </button>
                          )}
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="inline-flex items-center px-3 py-1.5 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
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
                        Create your first invoice to get started.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Detail Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Invoice Details - Admin View</h3>
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
                          {getStatusBadge(selectedInvoice.status)}
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
                          <p className="font-semibold text-gray-900">{selectedInvoice.client?.name}</p>
                          <p className="text-gray-600">{selectedInvoice.client?.email}</p>
                          <p className="text-gray-600">{selectedInvoice.client?.company || 'Individual Client'}</p>
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
                          {selectedInvoice.paymentDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Date:</span>
                              <span className="font-medium">{new Date(selectedInvoice.paymentDate).toLocaleDateString()}</span>
                            </div>
                          )}
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

                {/* Admin Actions Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h4>
                    
                    {/* Payment Summary */}
                    <div className="space-y-3 text-sm mb-6">
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

                    {/* Status Actions */}
                    <div className="space-y-3">
                      {selectedInvoice.status === 'draft' && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedInvoice._id, 'sent');
                            setShowInvoiceModal(false);
                          }}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Invoice
                        </button>
                      )}

                      {selectedInvoice.status === 'sent' && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedInvoice._id, 'paid');
                            setShowInvoiceModal(false);
                          }}
                          className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Paid
                        </button>
                      )}

                      <button
                        onClick={() => {/* TODO: Download functionality */}}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>

                      {selectedInvoice.status === 'paid' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">Payment Received</span>
                          </div>
                          {selectedInvoice.paymentMethod && (
                            <p className="text-sm text-green-700 mt-1">
                              Method: {selectedInvoice.paymentMethod.replace('_', ' ').toUpperCase()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Client Contact */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Client Contact</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{selectedInvoice.client?.email}</p>
                        {selectedInvoice.client?.phone && <p>{selectedInvoice.client?.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <select
                    name="projectId"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title} - {project.client?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      name="taxRate"
                      step="0.01"
                      defaultValue="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    placeholder="Invoice description..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows="2"
                    placeholder="Additional notes..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createInvoiceMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {createInvoiceMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Create Invoice'
                    )}
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

export default AdminBilling;
