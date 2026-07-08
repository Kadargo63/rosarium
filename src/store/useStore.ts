import { create } from 'zustand'
import type { PlantWithDetails, Log, Photo, Garden } from '@/types/schema'

interface RosariumState {
  plants: PlantWithDetails[]
  gardens: Garden[]
  selectedPlantId: string | null
  quickAddOpen: boolean
  setPlants: (plants: PlantWithDetails[]) => void
  setGardens: (gardens: Garden[]) => void
  setSelectedPlantId: (id: string | null) => void
  openQuickAdd: () => void
  closeQuickAdd: () => void
  addLog: (log: Log) => void
  addPhoto: (photo: Photo) => void // eslint-disable-line @typescript-eslint/no-unused-vars
}

export const useRosariumStore = create<RosariumState>((set) => ({
  plants: [],
  gardens: [],
  selectedPlantId: null,
  quickAddOpen: false,
  setPlants: (plants) => set({ plants }),
  setGardens: (gardens) => set({ gardens }),
  setSelectedPlantId: (id) => set({ selectedPlantId: id }),
  openQuickAdd: () => set({ quickAddOpen: true }),
  closeQuickAdd: () => set({ quickAddOpen: false }),
  addLog: (log) => set((state) => ({
    plants: state.plants.map((p) =>
      p.id === log.plant_id ? { ...p, latest_log: log, log_count: (p.log_count ?? 0) + 1 } : p
    ),
  })),
  addPhoto: (_photo: Photo) => set((state) => ({ plants: state.plants })), // eslint-disable-line @typescript-eslint/no-unused-vars
}))
