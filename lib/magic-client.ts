import { Magic } from 'magic-sdk';

export let magic: Magic;

if (typeof window !== "undefined") {
    magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY!); // ✨
}
