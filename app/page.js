
import HeroSection from '@/components/HeroSection'
import FeaturedPlugins from '@/components/FeaturedPlugins'
import PluginGrid from '@/components/PluginGrid'
import CategoriesSection from '@/components/CategoriesSection'
import CallToAction from '@/components/CallToAction'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedPlugins />
      <CategoriesSection />
      <PluginGrid />
      <CallToAction />
    </div>
  )
}
