import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { IDCardGenerator } from './IDCardGenerator';
import { getReferralLinks, getSponsorUserAsync, OFFICIAL_ROOT_SPONSOR_USER } from '../services/userService';
import { 
  ShieldCheck, 
  UserCheck, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  UserPlus,
  Share2,
  Link2
} from 'lucide-react';

interface SponsorCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorUser: UserProfile | null;
  sponsorId: string;
  onOpenRegisterWithSponsor: (sponsorId: string) => void;
  currentUser: UserProfile | null;
}

export const SponsorCardModal: React.FC<SponsorCardModalProps> = ({
  isOpen,
  onClose,
  sponsorUser,
  sponsorId,
  onOpenRegisterWithSponsor,
  currentUser,
}) => {
  const [copiedKey, setCopiedKey] = useState<'id' | 'id_link' | 'uname_link' | null>(null);
  const [resolvedSponsor, setResolvedSponsor] = useState<UserProfile | null>(sponsorUser);

  useEffect(() => {
    setResolvedSponsor(sponsorUser);
  }, [sponsorUser]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const lookupKey = (sponsorUser?.userId || sponsorId || '').trim();
    if (!lookupKey) return;

    const hydrateRealSponsorPhoto = async () => {
      if (sponsorUser?.photoUrl && sponsorUser.photoUrl.trim()) {
        return;
      }
      try {
        if (sponsorUser?.userId) {
          const mediaRes = await fetch(`/api/users/${encodeURIComponent(sponsorUser.userId)}/media`);
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json().catch(() => null);
            if (active && mediaData?.photoUrl && String(mediaData.photoUrl).trim()) {
              setResolvedSponsor((prev) => ({
                ...(prev || sponsorUser),
                photoUrl: String(mediaData.photoUrl).trim(),
              }));
              return;
            }
          }
        }
        const full = await getSponsorUserAsync(lookupKey);
        if (active && full) {
          setResolvedSponsor(full);
        }
      } catch {}
    };

    void hydrateRealSponsorPhoto();
    return () => {
      active = false;
    };
  }, [isOpen, sponsorUser, sponsorId]);

  if (!isOpen) return null;

  const activeSponsor = resolvedSponsor || sponsorUser;
  const effectiveId = (activeSponsor?.userId || sponsorId || 'IOIS999VK01').trim().toUpperCase();
  const links = getReferralLinks(effectiveId, activeSponsor?.username);
  const showSponsorPhoto = activeSponsor?.privacySettings?.showPhoto ?? true;
  const displaySponsorAvatar =
    showSponsorPhoto && activeSponsor?.photoUrl && activeSponsor.photoUrl.trim()
      ? activeSponsor.photoUrl.trim()
      : OFFICIAL_ROOT_SPONSOR_USER.photoUrl;

  const handleCopyValue = async (text: string, key: 'id' | 'id_link' | 'uname_link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const unameLine = links.usernameLink ? `\n🔗 *Username लिंक:* ${links.usernameLink}` : '';
    const text = `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nसत्यापित स्पॉन्सर: *${activeSponsor?.fullName || 'Official Sponsor'}* (ID: *${effectiveId}*${links.username ? ` • @${links.username}` : ''})\n\n👉 *इस स्पॉन्सर के तहत सीधे रजिस्टर करने के लिए लिंक खोलें:*\n🔗 *Unique ID लिंक:* ${links.userIdLink}${unameLine}\n\n🏷️ *Sponsor ID:* ${effectiveId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white my-4 max-h-[95vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-20 border border-slate-700 shadow-md"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2.5 pr-8 sm:pr-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>सत्यापित स्पॉन्सर आमंत्रण (VERIFIED SPONSOR INVITATION)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            आपको IOIS मिशन में आमंत्रित किया गया है!
          </h3>

          {/* Verified Sponsor Profile Picture & Identity Showcase */}
          <div className="max-w-md mx-auto flex items-center gap-3.5 p-3 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-lg text-left">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900 shadow-md">
              <img
                src={displaySponsorAvatar}
                alt={activeSponsor?.fullName || 'Verified Sponsor'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = OFFICIAL_ROOT_SPONSOR_USER.photoUrl;
                }}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                ✓ सत्यापित स्पॉन्सर (Verified Referrer)
              </span>
              <div className="text-sm sm:text-base font-black text-white truncate">
                {activeSponsor?.fullName || 'आधिकारिक स्पॉन्सर'}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="text-amber-300 font-black">{effectiveId}</span>
                {links.username && (
                  <span className="text-cyan-300 font-bold">@{links.username}</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            नीचे आपके आधिकारिक स्पॉन्सर का सत्यापित <strong>मास्क्ड डिजिटल पहचान पत्र</strong> है। सुरक्षा व गोपनीयता नीति के तहत व्यक्तिगत मोबाइल/ईमेल मास्क्ड हैं, जबकि यूनिक <strong>User ID</strong> व <strong>@Username</strong> स्पष्ट रूप से उपलब्ध हैं।
          </p>

          {/* Action Pills: Copy ID, Dual Referral Links (Unique ID + Username), WhatsApp Share */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            {/* Sponsor ID Highlight Box with 1-Click Copy */}
            <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
              <span className="text-xs text-slate-400 font-bold">Sponsor ID:</span>
              <span className="font-mono text-sm font-black text-amber-300 tracking-wider">
                {effectiveId}
              </span>
              {links.username && (
                <span className="text-[11px] font-mono text-cyan-300 font-bold">
                  @{links.username}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleCopyValue(effectiveId, 'id')}
                className={`px-2.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm ${
                  copiedKey === 'id'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {copiedKey === 'id' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'id' ? 'कॉपी हुआ!' : 'ID कॉपी'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Share */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp पर भेजें</span>
            </button>
          </div>

          {/* Dual Referral Links (Both IOIS Unique ID & Username Links) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto pt-2 text-left">
            <div className="flex items-center justify-between gap-2 bg-slate-950 border border-amber-500/35 rounded-xl px-3 py-2">
              <div className="min-w-0">
                <span className="text-[10px] font-black text-amber-300 uppercase flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  <span>IOIS Unique ID लिंक</span>
                </span>
                <div className="text-[11px] font-mono text-slate-300 truncate">{links.userIdLink}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyValue(links.userIdLink, 'id_link')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black shrink-0 flex items-center gap-1 cursor-pointer transition ${
                  copiedKey === 'id_link'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {copiedKey === 'id_link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'id_link' ? 'कॉपी हुआ' : 'कॉपी'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-950 border border-cyan-500/35 rounded-xl px-3 py-2">
              <div className="min-w-0">
                <span className="text-[10px] font-black text-cyan-300 uppercase flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  <span>Username लिंक {links.username ? `(@${links.username})` : ''}</span>
                </span>
                <div className="text-[11px] font-mono text-slate-300 truncate">
                  {links.usernameLink || 'यूजरनेम सेट नहीं है (Unique ID सक्रिय)'}
                </div>
              </div>
              {links.usernameLink && (
                <button
                  type="button"
                  onClick={() => handleCopyValue(links.usernameLink, 'uname_link')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black shrink-0 flex items-center gap-1 cursor-pointer transition ${
                    copiedKey === 'uname_link'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                  }`}
                >
                  {copiedKey === 'uname_link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'uname_link' ? 'कॉपी हुआ' : 'कॉपी'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Render Privacy-Protected Masked Sponsor ID Card */}
        <div className="pt-2">
          <IDCardGenerator
            currentUser={currentUser}
            targetUser={activeSponsor}
            isSponsorPreview={true}
            onOpenRegister={() => {
              onClose();
              onOpenRegisterWithSponsor(effectiveId);
            }}
            isModalMode={true}
          />
        </div>

        {/* Bottom Call-to-Action Bar */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 text-center sm:text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              इस स्पॉन्सर के तहत जुड़ने पर आपको <strong>50% से 70% इंस्टेंट पेआउट</strong> व संपूर्ण डिजिटल बुक्स किट प्राप्त होगी।
            </span>
          </div>

          {!currentUser ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegisterWithSponsor(effectiveId);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>इस स्पॉन्सर के साथ अभी रजिस्टर करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              बंद करें ✓
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
