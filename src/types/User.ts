
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
  partnerId?: string;
  partnerEmail?: string;
  partnerName?: string;
  touchesSent?: number;
  touchesReceived?: number;
}
