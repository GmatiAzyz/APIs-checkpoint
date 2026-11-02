import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Search,
  Mail,
  Building2,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  X,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Briefcase
} from 'lucide-react'

// Avatar color palette based on user ID
const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-fuchsia-600',
  'from-sky-500 to-blue-600',
  'from-teal-500 to-emerald-600',
  'from-fuchsia-500 to-rose-600',
  'from-cyan-500 to-indigo-600',
]

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function UserList() {
  // Required state variables
  const [listOfUsers, setListOfUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Additional UX state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [copiedField, setCopiedField] = useState(null)
  const [sortBy, setSortBy] = useState('name-asc')

  // Trigger to manually refetch data
  const [reloadKey, setReloadKey] = useState(0)

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }

  // Fetch users with Axios inside useEffect
  useEffect(() => {
    let ignore = false

    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!ignore) {
          setListOfUsers(response.data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error fetching users:', err)
          setError(err.message || 'Failed to fetch users. Please try again.')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [reloadKey])


  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUser(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Copy helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Filter users by name based on search input
  const filteredUsers = listOfUsers
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      if (sortBy === 'company') return a.company?.name.localeCompare(b.company?.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            JSONPlaceholder Directory
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            User Directory & Team Explorer
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Explore member profiles fetched live from the REST API. Search, inspect detailed company credentials, and connect instantly.
          </p>

          {/* Search Bar & Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="user-search-input"
                type="text"
                placeholder="Filter members by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-lg backdrop-blur-md text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                id="user-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-lg cursor-pointer"
              >
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="company">Sort: Company</option>
              </select>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh user list"
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Result counter */}
          {!loading && !error && (
            <div className="mt-4 text-xs sm:text-sm text-slate-400 font-medium">
              Showing <span className="text-indigo-400 font-bold">{filteredUsers.length}</span> of{' '}
              <span className="text-slate-300">{listOfUsers.length}</span> users
              {searchTerm && (
                <span>
                  {' '}
                  matching <span className="text-slate-200 font-semibold">"{searchTerm}"</span>
                </span>
              )}
            </div>
          )}
        </header>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <p className="text-xl font-semibold text-slate-200 animate-pulse">
              Loading users...
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Fetching profiles from JSONPlaceholder API via Axios...
            </p>

            {/* Skeleton Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 animate-pulse"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="h-3 bg-slate-800/80 rounded w-5/6" />
                    <div className="h-3 bg-slate-800/60 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 backdrop-blur-md shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-rose-200">Failed to Load Users</h2>
            <p className="text-slate-300 text-sm mt-2 mb-6">
              {error}
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition shadow-lg shadow-rose-600/30"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">No users found</h3>
            <p className="text-slate-400 text-sm mt-1 mb-6">
              No users match your search query "{searchTerm}". Try a different name.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* USER CARDS GRID */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const gradient =
                AVATAR_GRADIENTS[(user.id - 1) % AVATAR_GRADIENTS.length]
              const initials = getInitials(user.name)

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer backdrop-blur-sm flex flex-col justify-between"
                >
                  {/* Subtle hover glow accent */}
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Top Row: Avatar & Basic Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 ring-2 ring-white/10 group-hover:scale-105 transition-transform`}
                      >
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                            {user.name}
                          </h2>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium">
                          @{user.username || 'user'}
                        </p>
                      </div>
                    </div>

                    {/* Required Field: Email */}
                    <div className="mt-3 flex items-center gap-2.5 text-sm text-slate-300 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60">
                      <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {/* Required Field: Company Name */}
                    <div className="mt-2.5 flex items-center gap-2.5 text-sm text-slate-300 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60">
                      <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate font-medium">
                        {user.company?.name || 'Independent'}
                      </span>
                    </div>

                    {/* Location Sneak Peek */}
                    {user.address?.city && (
                      <div className="mt-2.5 flex items-center gap-2.5 text-xs text-slate-400 px-3 py-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{user.address.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action Hint */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-300 transition-colors">
                    <span>Click for full profile</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MODAL: ADDITIONAL USER DETAILS */}
        {selectedUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient accent top strip */}
              <div
                className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${
                  AVATAR_GRADIENTS[(selectedUser.id - 1) % AVATAR_GRADIENTS.length]
                }`}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${
                    AVATAR_GRADIENTS[(selectedUser.id - 1) % AVATAR_GRADIENTS.length]
                  } flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-white/10`}
                >
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-indigo-400 font-medium">
                      @{selectedUser.username}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      ID #{selectedUser.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Contact Information */}
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Contact Information
                  </h4>

                  <div className="space-y-2.5 text-sm">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                        <a
                          href={`mailto:${selectedUser.email}`}
                          className="hover:underline text-indigo-300 truncate"
                        >
                          {selectedUser.email}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUser.email, 'email')}
                        className="text-slate-400 hover:text-white p-1 rounded transition"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <a
                          href={`tel:${selectedUser.phone}`}
                          className="hover:underline text-slate-200"
                        >
                          {selectedUser.phone}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUser.phone, 'phone')}
                        className="text-slate-400 hover:text-white p-1 rounded transition"
                        title="Copy phone"
                      >
                        {copiedField === 'phone' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      <a
                        href={`https://${selectedUser.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline"
                      >
                        {selectedUser.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Company & Role
                  </h4>

                  <div className="space-y-1.5">
                    <p className="text-base font-semibold text-white">
                      {selectedUser.company?.name}
                    </p>
                    {selectedUser.company?.catchPhrase && (
                      <p className="text-xs text-indigo-300 italic">
                        "{selectedUser.company.catchPhrase}"
                      </p>
                    )}
                    {selectedUser.company?.bs && (
                      <div className="mt-2 inline-block px-2.5 py-1 rounded-md bg-slate-800 text-xs text-slate-300">
                        Focus: {selectedUser.company.bs}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Physical Address
                  </h4>

                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-medium text-white">
                      {selectedUser.address?.street}, {selectedUser.address?.suite}
                    </p>
                    <p>
                      {selectedUser.address?.city}, {selectedUser.address?.zipcode}
                    </p>

                    {selectedUser.address?.geo && (
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span>
                          Coordinates: {selectedUser.address.geo.lat},{' '}
                          {selectedUser.address.geo.lng}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${selectedUser.address.geo.lat},${selectedUser.address.geo.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-medium"
                        >
                          View Map
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
