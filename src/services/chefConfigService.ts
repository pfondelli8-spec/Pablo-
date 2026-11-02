/**
 * SERVICIO DE CONFIGURACIÓN DE CHEFS Y RESPONSABLES DE COCINA
 * Permite gestionar las fotografías, nombres y perfiles de los chefs para:
 * - Cocina — Hotel Bitácora (Antonio González)
 * - Cocina — Hotel Vulcano (Giacomo Longo)
 * Persistencia en localStorage y configurable desde el Panel de Administración.
 */

export interface ChefProfile {
  hotelId: string;
  hotelName: string;
  chefName: string;
  roleTitle: string;
  photoUrl: string;
  bio: string;
  updatedAt: string;
}

const STORAGE_CHEF_PROFILES_KEY = 'proa_hotel_chef_profiles_v1';

export const DEFAULT_CHEF_PROFILES: Record<string, ChefProfile> = {
  'model-bitacora': {
    hotelId: 'model-bitacora',
    hotelName: 'Hotel Bitácora',
    chefName: 'Antonio González',
    roleTitle: 'Chef Ejecutivo & Responsable Gastronómico',
    photoUrl: '/assets/aistudio/chef1_6d694bfa.jfif',
    bio: 'Llevo 21 años en Spring y empecé desde los puestos más bajos hasta ser chef de Bitácora.',
    updatedAt: new Date().toISOString()
  },
  'model-vulcano': {
    hotelId: 'model-vulcano',
    hotelName: 'Hotel Vulcano',
    chefName: 'Giacomo Longo',
    roleTitle: 'Chef Ejecutivo & Alta Cocina de Autor',
    photoUrl: '/assets/aistudio/chef2_7a8fd6b5.png',
    bio: 'Granadilla de Abona, Canarias, España · Gastronomía de autor, cocina de vanguardia y producto de cercanía.',
    updatedAt: new Date().toISOString()
  }
};

export const chefConfigService = {
  getProfiles(): Record<string, ChefProfile> {
    try {
      const saved = localStorage.getItem(STORAGE_CHEF_PROFILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CHEF_PROFILES,
          ...parsed
        };
      }
    } catch (e) {
      console.warn('Error reading chef profiles:', e);
    }
    return { ...DEFAULT_CHEF_PROFILES };
  },

  getProfileForHotel(hotelId: string): ChefProfile {
    const profiles = this.getProfiles();
    if (profiles[hotelId]) {
      return profiles[hotelId];
    }
    // Fallback por coincidencia de nombre
    if (hotelId.includes('vulcano')) {
      return profiles['model-vulcano'];
    }
    return profiles['model-bitacora'];
  },

  saveProfile(hotelId: string, updatedProfile: Partial<ChefProfile>): ChefProfile {
    const current = this.getProfiles();
    const existing = current[hotelId] || this.getProfileForHotel(hotelId);
    const updated: ChefProfile = {
      ...existing,
      ...updatedProfile,
      hotelId,
      updatedAt: new Date().toISOString()
    };
    current[hotelId] = updated;

    try {
      localStorage.setItem(STORAGE_CHEF_PROFILES_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('proa_chef_profiles_updated'));
    } catch (e) {
      console.error('Error saving chef profile:', e);
    }

    return updated;
  },

  resetProfile(hotelId: string): ChefProfile {
    const current = this.getProfiles();
    const defaultProfile = DEFAULT_CHEF_PROFILES[hotelId] || DEFAULT_CHEF_PROFILES['model-bitacora'];
    current[hotelId] = { ...defaultProfile };

    try {
      localStorage.setItem(STORAGE_CHEF_PROFILES_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('proa_chef_profiles_updated'));
    } catch (e) {
      console.error('Error resetting chef profile:', e);
    }

    return current[hotelId];
  }
};
