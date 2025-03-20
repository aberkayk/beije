export interface ProfileInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  passwordHash: string;
}

export interface CycleStatus {
  isRegistrationComplete: boolean;
  inOnboardingCompleted: boolean;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    _id: string;
    profileInfo: ProfileInfo;
    cycleStatus: CycleStatus;
  };
}

export interface ProfileData {
  _id: string;
  profileInfo: ProfileInfo;
  cycleStatus: CycleStatus;
}
