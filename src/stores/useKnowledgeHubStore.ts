import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Material } from '@/components/clinica/KnowledgeHubApp';
import { deletePdf } from '@/lib/knowledgeHub/pdfStorage';

export interface MaterialUsuario extends Material {
  isUserAdded: true;
  pdfBlobKey?: string;
}

interface KnowledgeHubState {
  materiaisUsuario: MaterialUsuario[];
  addMaterial: (material: Omit<MaterialUsuario, 'id' | 'isUserAdded'>) => string;
  removeMaterial: (id: string) => Promise<void>;
}

export const useKnowledgeHubStore = create<KnowledgeHubState>()(
  persist(
    (set, get) => ({
      materiaisUsuario: [],

      addMaterial: (material) => {
        const id = `user-${uuidv4()}`;
        const novo: MaterialUsuario = {
          ...material,
          id,
          isUserAdded: true,
        };
        set({ materiaisUsuario: [novo, ...get().materiaisUsuario] });
        return id;
      },

      removeMaterial: async (id) => {
        const material = get().materiaisUsuario.find((m) => m.id === id);
        if (material?.pdfBlobKey) {
          await deletePdf(material.pdfBlobKey);
        }
        set({
          materiaisUsuario: get().materiaisUsuario.filter((m) => m.id !== id),
        });
      },
    }),
    {
      name: 'auris-knowledge-hub-user-materials',
      partialize: (state) => ({
        materiaisUsuario: state.materiaisUsuario,
      }),
    }
  )
);
