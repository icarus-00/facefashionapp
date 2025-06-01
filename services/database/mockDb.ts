import { generationsWithImage, ActorWithImage } from "@/services/database/db";
import { generationsConstants } from "@/constants/generations";
import { mockActors } from "@/constants/actorsMock";

class MockDatabaseService {
  private actors: ActorWithImage[] = [...mockActors];

  // Generation methods
  async listGenerations(): Promise<generationsWithImage[]> {
    return generationsConstants;
  }

  async deleteGeneration(documentId: string): Promise<void> {
    console.log(`Mock delete generation ${documentId}`);
  }

  async getGeneration(documentId: string): Promise<generationsWithImage> {
    const generation = generationsConstants.find(g => g.$id === documentId);
    if (!generation) throw new Error("Generation not found");
    return generation;
  }

  // Actor methods
  async listActors(): Promise<ActorWithImage[]> {
    return this.actors;
  }

  async getActor(documentId: string): Promise<ActorWithImage> {
    const actor = this.actors.find(a => a.$id === documentId);
    if (!actor) throw new Error("Actor not found");
    return actor;
  }

  async addActor(actorData: Partial<ActorWithImage>): Promise<ActorWithImage> {
    const newActor = {
      ...actorData,
      $id: `actor_${this.actors.length + 1}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    } as ActorWithImage;
    
    this.actors.push(newActor);
    return newActor;
  }

  async editActor(documentId: string, updates: Partial<ActorWithImage>): Promise<void> {
    this.actors = this.actors.map(actor => {
      if (actor.$id === documentId) {
        return { ...actor, ...updates, $updatedAt: new Date().toISOString() };
      }
      return actor;
    });
  }

  async deleteActor(documentId: string): Promise<void> {
    this.actors = this.actors.filter(actor => actor.$id !== documentId);
  }
}

const mockDatabaseService = new MockDatabaseService();

export default mockDatabaseService;
export type { generationsWithImage, ActorWithImage };