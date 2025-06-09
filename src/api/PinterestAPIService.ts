import { PinterestPin } from "../types";

class PinterestService {
  private apiKey: string;
  private baseUrl = "https://api.pinterest.com/v5";

  constructor() {
    // Vite automatically handles import.meta.env at build time
    this.apiKey = import.meta.env.VITE_PINTEREST_API_KEY || "demo";
  }

  async searchPins(query: string, limit: number = 12): Promise<PinterestPin[]> {
    if (this.apiKey === "demo") {
      console.log(
        "📌 Pinterest Demo Mode - Add VITE_PINTEREST_API_KEY to .env for real API"
      );
      return this.getMockData(query);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search/pins/?query=wedding ${encodeURIComponent(
          query
        )}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Pinterest API Error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      return this.transformPinterestData(data.items || []);
    } catch (error) {
      console.warn("Pinterest API failed, using mock data:", error);
      return this.getMockData(query);
    }
  }

  private transformPinterestData(items: any[]): PinterestPin[] {
    return items.map((pin) => ({
      id: pin.id,
      title: pin.title || "Wedding Inspiration",
      description: pin.description || "",
      imageUrl:
        pin.media?.images?.["564x"]?.url ||
        pin.media?.images?.original?.url ||
        "",
      link: pin.link || `https://pinterest.com/pin/${pin.id}`,
      boardName: pin.board?.name,
      creatorName: pin.creator?.username,
      saveCount: pin.save_count,
    }));
  }

  private getMockData(query: string): PinterestPin[] {
    const mockData = {
      cake: [
        {
          id: "cake-1",
          title: "Elegant Three-Tier Wedding Cake",
          description:
            "Beautiful white wedding cake with fresh flowers and gold accents. Perfect for elegant ceremonies.",
          imageUrl:
            "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/elegant-wedding-cake",
          boardName: "Wedding Cakes",
          creatorName: "WeddingPlanner",
          saveCount: 1250,
        },
        {
          id: "cake-2",
          title: "Rustic Naked Wedding Cake",
          description:
            "Semi-naked cake with berries and greenery. Perfect for outdoor rustic weddings.",
          imageUrl:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/rustic-wedding-cake",
          boardName: "Rustic Wedding Ideas",
          creatorName: "RusticWeddings",
          saveCount: 892,
        },
        {
          id: "cake-3",
          title: "Modern Geometric Wedding Cake",
          description:
            "Contemporary design with geometric patterns and metallic details.",
          imageUrl:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/modern-wedding-cake",
          boardName: "Modern Wedding Inspiration",
          creatorName: "ModernBride",
          saveCount: 654,
        },
      ],
      dress: [
        {
          id: "dress-1",
          title: "Classic A-Line Wedding Dress",
          description:
            "Timeless A-line silhouette with lace details and long train.",
          imageUrl:
            "https://images.unsplash.com/photo-1594736797933-d0a9ba7c29d0?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/classic-wedding-dress",
          boardName: "Wedding Dresses",
          creatorName: "BridalBoutique",
          saveCount: 2341,
        },
        {
          id: "dress-2",
          title: "Bohemian Lace Wedding Dress",
          description:
            "Free-spirited boho dress with intricate lace and flowing sleeves.",
          imageUrl:
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/boho-wedding-dress",
          boardName: "Boho Wedding Style",
          creatorName: "BohoWeddings",
          saveCount: 1876,
        },
      ],
      flowers: [
        {
          id: "flowers-1",
          title: "Classic White Rose Bouquet",
          description: "Timeless white roses with eucalyptus greenery.",
          imageUrl:
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/white-rose-bouquet",
          boardName: "Wedding Flowers",
          creatorName: "FloralDesigns",
          saveCount: 1432,
        },
        {
          id: "flowers-2",
          title: "Wildflower Meadow Bouquet",
          description: "Natural wildflower mix perfect for outdoor ceremonies.",
          imageUrl:
            "https://images.unsplash.com/photo-1594736797933-d0a9ba7c29d0?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/wildflower-bouquet",
          boardName: "Boho Flowers",
          creatorName: "WildBloom",
          saveCount: 987,
        },
      ],
      venue: [
        {
          id: "venue-1",
          title: "Garden Wedding Venue",
          description:
            "Beautiful outdoor garden setting with natural archways.",
          imageUrl:
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/garden-wedding-venue",
          boardName: "Wedding Venues",
          creatorName: "VenueHunter",
          saveCount: 987,
        },
        {
          id: "venue-2",
          title: "Rustic Barn Wedding",
          description:
            "Charming barn venue with string lights and rustic decor.",
          imageUrl:
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/barn-wedding-venue",
          boardName: "Rustic Venues",
          creatorName: "BarnWeddings",
          saveCount: 1543,
        },
      ],
      photography: [
        {
          id: "photo-1",
          title: "Romantic Wedding Photography",
          description:
            "Soft, romantic lighting with natural poses and candid moments.",
          imageUrl:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/romantic-photography",
          boardName: "Wedding Photography",
          creatorName: "RomanticShots",
          saveCount: 2156,
        },
      ],
      decoration: [
        {
          id: "decor-1",
          title: "Elegant Table Centerpieces",
          description:
            "Gold candelabras with white flowers and greenery for elegant reception tables.",
          imageUrl:
            "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=600&fit=crop",
          link: "https://pinterest.com/pin/elegant-centerpieces",
          boardName: "Wedding Decor",
          creatorName: "ElegantEvents",
          saveCount: 1789,
        },
      ],
    };

    // Smart keyword matching
    const keywords = Object.keys(mockData);
    const matchedKey = keywords.find((keyword) =>
      query.toLowerCase().includes(keyword)
    );

    return mockData[matchedKey as keyof typeof mockData] || mockData.flowers;
  }

  isDemoMode(): boolean {
    return this.apiKey === "demo";
  }

  getApiStatus(): string {
    return this.isDemoMode()
      ? "Demo Mode - Using curated inspirations"
      : "Pinterest API Active";
  }
}

export default PinterestService;
