import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Save, 
  Camera,
  Shield,
  Calendar,
  MapPin,
  Globe,
  Edit3,
  Check,
  X,
  Settings,
  Award,
  Briefcase,
  Bell,
  BellOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePushNotifications } from '../hooks/usePushNotifications';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { isSupported, isSubscribed, loading, subscribeToNotifications, unsubscribeFromNotifications } = usePushNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      company: user?.company || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully!');
        reset(data); // Reset form with new data
      } else {
        setError('root', { message: result.message });
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'client':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      client: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return styles[role] || styles.client;
  };

  return (
    <>
      <SEOHead
        title="Profile Settings - EpicEdge Creative"
        description="Manage your account information and preferences."
        url="/profile"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
              <p className="text-xl text-white/90">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/80 to-orange-600/80"></div>
                  <div className="relative">
                    <div className="mx-auto h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-2xl border border-white/30">
                      <span className="text-3xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
                    <button className="absolute bottom-0 right-8 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h3>
                    <p className="text-gray-600 mb-3">{user?.email}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge(user?.role)}`}>
                      {getRoleIcon(user?.role)}
                      <span className="ml-1 capitalize">{user?.role}</span>
                    </div>
            </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      </div>
              </div>
                    
              {user?.company && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Building className="w-5 h-5 text-gray-500 mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700">Company</p>
                          <p className="text-sm text-gray-600">{user.company}</p>
                        </div>
                      </div>
                    )}
                    
                    {user?.phone && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Phone className="w-5 h-5 text-gray-500 mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700">Phone</p>
                          <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">Member Since</p>
                        <p className="text-sm text-gray-600">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-amber-600" />
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Shield className="w-4 h-4 mr-3 text-gray-500" />
                    Security Settings
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Globe className="w-4 h-4 mr-3 text-gray-500" />
                    Privacy Preferences
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Award className="w-4 h-4 mr-3 text-gray-500" />
                    Account Statistics
                  </button>
                </div>
              </div>
          </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Update Profile Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Edit3 className="w-6 h-6 mr-3 text-amber-600" />
                    Update Profile Information
                </h3>
                  <p className="text-gray-600 mt-2">
                    Keep your personal information up to date for better service.
                </p>
              </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                {errors.root && (
                    <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                      <X className="w-4 h-4 mr-2" />
                    {errors.root.message}
                  </div>
                )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="group">
                      <label htmlFor="name" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <User className="w-4 h-4 mr-2 text-amber-600" />
                        Full Name *
                    </label>
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium shadow-sm group-hover:shadow-md"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          {errors.name.message}
                        </p>
                    )}
                  </div>

                    <div className="group">
                      <label htmlFor="email" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-amber-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-medium shadow-sm"
                      disabled
                    />
                      <p className="mt-2 text-xs text-gray-500 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Email cannot be changed for security reasons
                    </p>
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="group">
                      <label htmlFor="company" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Building className="w-4 h-4 mr-2 text-amber-600" />
                        Company / Organization
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium shadow-sm group-hover:shadow-md"
                      placeholder="Enter your company name"
                    />
                  </div>

                    <div className="group">
                      <label htmlFor="phone" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Phone className="w-4 h-4 mr-2 text-amber-600" />
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium shadow-sm group-hover:shadow-md"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                  <div className="mb-8">
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Shield className="w-4 h-4 mr-2 text-amber-600" />
                      Account Role
                    </label>
                    <div className="flex items-center p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getRoleBadge(user?.role)}`}>
                        {getRoleIcon(user?.role)}
                        <span className="ml-2 capitalize">{user?.role}</span>
                      </div>
                      <p className="ml-4 text-sm text-gray-600">
                        Role is managed by administrators
                      </p>
                    </div>
                  </div>

                  {/* Push Notifications Section */}
                  {isSupported && (
                    <div className="mb-8">
                      <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Bell className="w-4 h-4 mr-2 text-amber-600" />
                        Push Notifications
                      </label>
                      <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Receive notifications about your projects and updates
                          </p>
                          <p className="text-xs text-gray-500">
                            {isSubscribed ? 'Currently subscribed to notifications' : 'Click subscribe to enable notifications'}
                          </p>
                        </div>
                        <button
                          onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
                          disabled={loading}
                          className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                            isSubscribed
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                              <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-8 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={() => reset()}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                  >
                      <X className="w-4 h-4" />
                      <span>Reset Changes</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                      </>
                    ) : (
                      <>
                          <Check className="w-5 h-5" />
                          <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-amber-600" />
                  Account Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Account Status</p>
                        <p className="text-2xl font-bold text-blue-900">Active</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Profile Complete</p>
                        <p className="text-2xl font-bold text-green-900">85%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-600">Last Updated</p>
                        <p className="text-2xl font-bold text-amber-900">Today</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
