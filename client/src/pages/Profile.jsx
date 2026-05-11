import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { requestDeletionOTP, confirmDeletion } from '../api/users'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOTP = async () => {
    try {
      setLoading(true)
      const res = await requestDeletionOTP()
      toast.success(res.data.message || 'OTP sent to your email')
      setOtpSent(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeletion = async () => {
    if (!otp) return toast.error('Please enter the OTP')

    try {
      setLoading(true)
      await confirmDeletion(otp)
      toast.success('Account deleted successfully. We\'re sorry to see you go.')
      logout()
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] selection:bg-[#E8CFC4] selection:text-stone-900">
      <Navbar />
      
      <main className="flex-grow pt-56 pb-40 relative overflow-hidden">
        {/* Luxury Background Accents */}
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#F8F5F2] to-transparent pointer-events-none" />
        <div className="absolute top-[20%] -right-32 w-[600px] h-[600px] bg-[#E8CFC4]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-[#C8A97E]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto px-6">
            
            {/* Nav Header */}
            <div className="flex items-center mb-24 animate-fade-in">
              <Link to="/" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-[#C8A97E] transition-all">
                <span className="w-8 h-px bg-stone-200 group-hover:w-12 group-hover:bg-[#C8A97E] transition-all"></span>
                Back to Collection
              </Link>
            </div>

            {/* Profile Header Card - Perfect Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-xl rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white/50 p-12 md:p-24 mb-32 relative overflow-hidden group z-20">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#C8A97E] via-[#E8CFC4] to-transparent" />
              <div className="relative z-10">
                <div className="flex flex-col items-start">
                  <div className="inline-flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8A97E] px-3 py-1 bg-[#F8F5F2] border border-[#E8CFC4]/20">
                      {user.role}
                    </span>
                    <div className="h-px w-12 bg-stone-100" />
                  </div>
                  <h1 className="text-6xl md:text-8xl font-bold font-serif text-stone-900 tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                    {user.name}
                  </h1>
                  <p className="text-stone-400 text-xl md:text-2xl font-light tracking-wide italic font-serif">
                    {user.email}
                  </p>
                </div>
              </div>
              {/* Subtle Decorative RA */}
              <div className="absolute -bottom-10 -right-10 text-[200px] font-serif font-black text-stone-50/50 select-none pointer-events-none group-hover:translate-x-4 transition-transform duration-1000">
                RA
              </div>
            </div>

            {/* Activity Links - Elegant Stack */}
            <div className="flex flex-col gap-10 mb-24 relative z-10">
              <Link to="/my-bookings" className="group relative p-12 md:p-16 bg-white/60 backdrop-blur-lg border border-white/40 rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_25px_55px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col items-start hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F8F5F2]/50 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <div className="w-20 h-20 bg-white shadow-sm flex items-center justify-center text-5xl mb-12 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                  📅
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-stone-900 mb-4 font-serif tracking-tight group-hover:text-[#C8A97E] transition-colors">Your Bookings</h3>
                  <p className="text-xl text-stone-400 leading-relaxed max-w-2xl font-light">
                    Access and manage your exclusive wedding venue reservations, track status updates, and view your complete event history.
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 group-hover:text-stone-800 transition-colors">
                  View Detail <span className="text-lg">→</span>
                </div>
              </Link>

              <Link to="/favorites" className="group relative p-12 md:p-16 bg-white/60 backdrop-blur-lg border border-white/40 rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_25px_55px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col items-start hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F8F5F2]/50 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <div className="w-20 h-20 bg-white shadow-sm flex items-center justify-center text-5xl mb-12 group-hover:-rotate-6 transition-transform duration-500 relative z-10">
                  ❤️
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-stone-900 mb-4 font-serif tracking-tight group-hover:text-[#C8A97E] transition-colors">Your Favorites</h3>
                  <p className="text-xl text-stone-400 leading-relaxed max-w-2xl font-light">
                    Explore your curated collection of loved venues and locations, handpicked for your perfect celebration.
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 group-hover:text-stone-800 transition-colors">
                  View Collection <span className="text-lg">→</span>
                </div>
              </Link>
            </div>

            {/* Danger Zone - Premium Termination UI */}
            <div className="p-12 md:p-16 bg-white/40 border border-red-50 rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.01)] flex flex-col items-start mb-32 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-50 to-transparent" />
              <div className="flex flex-col items-start gap-12 w-full relative z-10">
                <div className="w-full">
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-16 h-16 bg-white text-red-600 flex items-center justify-center text-3xl shadow-sm border border-red-50 group-hover:bg-red-50 transition-colors">
                      ⚠️
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-stone-800 tracking-tight">Account Termination</h2>
                  </div>
                  <p className="text-stone-400 text-xl md:text-2xl leading-relaxed max-w-3xl font-light">
                    Permanently delete your profile and all associated data. This action is <span className="text-red-400 font-medium">irreversible</span> and will remove all your bookings, messages, and saved preferences.
                  </p>
                </div>

                <div className="w-full max-w-md">
                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="group flex items-center justify-between w-full px-10 py-6 bg-white border border-red-100 text-red-400 font-bold rounded-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-500 shadow-sm active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                    >
                      Delete My Account
                      <span className="text-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="group flex items-center justify-between w-full px-10 py-6 bg-white border border-red-100 text-red-400 font-bold rounded-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-500 shadow-sm active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                    >
                      Cancel Action
                      <span className="text-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                    </button>
                  )}
                </div>
              </div>

              {showDeleteConfirm && (
                <div className="w-full mt-16 pt-16 border-t border-stone-100 animate-fade-in relative z-10">
                  {!otpSent ? (
                    <div className="bg-white p-12 md:p-16 rounded-none shadow-[0_35px_75px_rgba(0,0,0,0.04)] border border-stone-100 w-full max-w-3xl text-left relative overflow-hidden">
                      <div className="flex flex-col items-start">
                        <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg mb-10">
                          🛡️
                        </div>
                        <h4 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 mb-6 tracking-tight">Identity Verification</h4>
                        <p className="text-stone-400 mb-16 text-xl leading-relaxed max-w-xl font-light">
                          For your security, we need to confirm your identity before proceeding with account deletion.
                        </p>
                        <button 
                          onClick={handleRequestOTP}
                          disabled={loading}
                          className="group flex items-center justify-between w-full max-w-sm px-10 py-6 bg-white border border-red-100 text-red-500 font-bold rounded-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-500 shadow-sm active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                        >
                          {loading ? 'Processing...' : 'Request Security Code'}
                          <span className="text-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-12 md:p-16 rounded-none shadow-[0_35px_75px_rgba(0,0,0,0.04)] border border-stone-100 w-full max-w-2xl text-left relative overflow-hidden">
                      <div className="flex flex-col items-start">
                        <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg mb-10">
                          🗝️
                        </div>
                        <h4 className="text-3xl md:text-4xl font-bold font-serif text-stone-800 mb-6 tracking-tight">Access Required</h4>
                        <p className="text-stone-400 mb-12 text-xl leading-relaxed font-light">
                          A 6-digit secure code has been dispatched to your email.
                        </p>
                        <div className="w-full space-y-12">
                          <input 
                            type="text" 
                            maxLength="6"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full py-8 text-left text-6xl md:text-7xl font-bold tracking-[0.5em] rounded-none border-b-2 border-stone-200 focus:border-[#C8A97E] focus:ring-0 outline-none transition-all placeholder:text-stone-100 bg-transparent"
                          />
                          <div className="flex flex-col items-start gap-8">
                            <button 
                              onClick={handleConfirmDeletion}
                              disabled={loading || otp.length !== 6}
                              className="group flex items-center justify-between w-full max-w-sm px-10 py-6 bg-white border border-red-100 text-red-500 font-bold rounded-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-500 shadow-sm active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                            >
                              {loading ? 'Validating...' : 'Confirm Termination'}
                              <span className="text-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                            </button>
                            <button 
                              onClick={() => { setOtpSent(false); setOtp(''); }}
                              className="text-[10px] font-black text-stone-900 hover:text-[#C8A97E] transition-all uppercase tracking-[0.5em] pb-1 border-b border-stone-100 hover:border-[#C8A97E]"
                            >
                              Resend Secure Code
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Spacer */}
            <div className="h-60 w-full" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
