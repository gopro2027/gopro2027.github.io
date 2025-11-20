<script>
  import DollarSign from 'path/to/DollarSign';
  import Wrench from 'path/to/Wrench';
  import Gamepad2 from 'path/to/Gamepad2';
  import Github from 'path/to/Github';
  import Cpu from 'path/to/Cpu';
  import Shield from 'path/to/Shield';
</script>

<div>
  <!-- Hero Section -->
  <section class="px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Hero Content -->
        <div class="space-y-8">
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
            OASMan Air Suspension System
          </h1>
          <p class="text-lg text-muted-foreground">
            Transform your vehicle's ride with open-source, customizable air suspension.
          </p>
          <div class="pt-4 space-y-2">
            <div class="flex items-center gap-3 text-sm text-muted-foreground">
              <DollarSign size={18} class="text-primary" />
              <span><span class="font-semibold text-foreground">67% cheaper</span> than proprietary alternatives</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-muted-foreground">
              <Wrench size={18} class="text-primary" />
              <span>Fully <span class="font-semibold text-foreground">customizable</span> and open source</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-muted-foreground">
              <Gamepad2 size={18} class="text-primary" />
              <span><span class="font-semibold text-foreground">Gaming controller support</span> included</span>
            </div>
          </div>
          <a href="https://github.com" class="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 font-medium hover:bg-secondary transition">
            Documentation
          </a>
        </div>

        <!-- Hero Image -->
        <div class="relative h-96 lg:h-full">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 overflow-hidden">
            <img 
              src="/placeholder.svg?height=400&width=400"
              alt="OASMan Air Suspension System"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Cost Comparison -->
  <section class="border-b border-border/40 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose OASMan?</h2>
        <p class="mt-4 text-lg text-muted-foreground">Save money while gaining complete control over your suspension</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Airlift -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6">
          <h3 class="text-lg font-semibold mb-4">Airlift 3P/3H</h3>
          <div class="mb-6">
            <div class="text-4xl font-bold text-muted-foreground line-through">$1500</div>
          </div>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>✓ Proprietary software</li>
            <li>✓ Limited customization</li>
            <li>✗ Expensive repairs</li>
            <li>✗ No gaming controller support</li>
          </ul>
        </div>

        <!-- Airtek -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6">
          <h3 class="text-lg font-semibold mb-4">Airtek Stage 2+</h3>
          <div class="mb-6">
            <div class="text-4xl font-bold text-muted-foreground line-through">$1000</div>
          </div>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>✓ More affordable</li>
            <li>✓ Some customization</li>
            <li>✗ Closed ecosystem</li>
            <li>✗ No gaming controller support</li>
          </ul>
        </div>

        <!-- OASMan -->
        <div class="rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-6 relative">
          <div class="absolute -top-3 right-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">BEST VALUE</div>
          <h3 class="text-lg font-semibold mb-4 text-primary">OASMan</h3>
          <div class="mb-6">
            <div class="text-4xl font-bold text-primary">Under $500</div>
            <p class="text-sm text-muted-foreground mt-1">DIY Build Cost</p>
          </div>
          <ul class="space-y-2 text-sm">
            <li class="text-primary font-medium">✓ Fully open source</li>
            <li class="text-primary font-medium">✓ Unlimited customization</li>
            <li class="text-primary font-medium">✓ $10 sensor replacements</li>
            <li class="text-primary font-medium">✓ Gaming controller support</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="border-b border-border/40 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
        <p class="mt-4 text-lg text-muted-foreground">Everything you need for a modern air suspension system</p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- DIY Focus -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Wrench class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">DIY Friendly</h3>
          <p class="text-sm text-muted-foreground">Build it yourself with well-documented guides and community support. Everything you need is accessible and affordable.</p>
        </div>

        <!-- Open Source -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Github class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">100% Open Source</h3>
          <p class="text-sm text-muted-foreground">Fully customizable code. No proprietary lock-in. Modify, improve, and share your changes with the community.</p>
        </div>

        <!-- Gaming Support -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Gamepad2 class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">Gaming Controllers</h3>
          <p class="text-sm text-muted-foreground">Control your suspension with PS3, PS4, or Xbox controllers. A feature no commercial system offers.</p>
        </div>

        <!-- Affordable Repairs -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <DollarSign class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">Affordable Parts</h3>
          <p class="text-sm text-muted-foreground">Replace individual sensors for $10 instead of buying entire $1000 manifold units. Keep your system running.</p>
        </div>

        <!-- Customization -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Cpu class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">Total Customization</h3>
          <p class="text-sm text-muted-foreground">Customize the app to match your build. Use bespoke valves, sensors, and components exactly how you want them.</p>
        </div>

        <!-- Reliability -->
        <div class="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Shield class="text-primary" size={24} />
          </div>
          <h3 class="text-lg font-semibold">Future Proof</h3>
          <p class="text-sm text-muted-foreground">No dependency on a single company. Your system won't become obsolete when support ends.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Controller Showcase -->
  <section id="controller" class="border-b border-border/40 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-12 lg:grid-cols-2 items-center">
        <div class="space-y-8">
          <div class="space-y-4">
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
              Control With Any <span class="text-primary">Gaming Controller</span>
            </h2>
            <p class="text-lg text-muted-foreground">
              OASMan's unique gaming controller support lets you manage your suspension system like never before. Use PlayStation 3, PlayStation 4, or Xbox controllers — no proprietary hardware required.
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">1</div>
              <div>
                <h4 class="font-semibold">Connect Your Controller</h4>
                <p class="text-sm text-muted-foreground mt-1">Pair any compatible gaming controller via Bluetooth or USB</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">2</div>
              <div>
                <h4 class="font-semibold">Map Custom Actions</h4>
                <p class="text-sm text-muted-foreground mt-1">Assign any suspension function to any button on your controller</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">3</div>
              <div>
                <h4 class="font-semibold">Adjust On The Fly</h4>
                <p class="text-sm text-muted-foreground mt-1">Tweak ride height, pressure, and more with precision control</p>
              </div>
            </div>
          </div>

          <p class="text-sm text-muted-foreground italic border-l-2 border-primary pl-4">
            "Control your system with a PS3/PS4/Xbox controller? Yep, we have that." — The possibilities are endless with OASMan.
          </p>
        </div>

        <div class="relative h-96 lg:h-full">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 overflow-hidden">
            <img 
              src="/placeholder.svg?height=400&width=400"
              alt="Gaming Controller Support"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Perfect For Section -->
  <section class="border-b border-border/40 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Perfect For</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-border/40 bg-card/50 p-8 space-y-3">
          <h3 class="text-xl font-semibold text-primary">DIY Enthusiasts</h3>
          <p class="text-muted-foreground">Build your own suspension system with professional-grade components and full customization control.</p>
        </div>
        <div class="rounded-xl border border-border/40 bg-card/50 p-8 space-y-3">
          <h3 class="text-xl font-semibold text-primary">Budget-Conscious Builders</h3>
          <p class="text-muted-foreground">Get professional results for a fraction of the cost. Save thousands compared to commercial alternatives.</p>
        </div>
        <div class="rounded-xl border border-border/40 bg-card/50 p-8 space-y-3">
          <h3 class="text-xl font-semibold text-primary">Restomod Projects</h3>
          <p class="text-muted-foreground">Upgrade vintage air suspension systems with modern technology and open-source reliability.</p>
        </div>
        <div class="rounded-xl border border-border/40 bg-card/50 p-8 space-y-3">
          <h3 class="text-xl font-semibold text-primary">Custom Car Builders</h3>
          <p class="text-muted-foreground">No limits. If you can imagine it, OASMan can support it. Customize every aspect to match your vision.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="pricing" class="border-b border-border/40 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center space-y-8">
      <div class="space-y-4">
        <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to Build Your Own Suspension?
        </h2>
        <p class="text-lg text-muted-foreground">
          Join the community of DIY builders creating professional-grade suspension systems for less than $500.
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <a href="https://github.com" class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition">
          <Github size={20} />
          View GitHub Repository
        </a>
        <button class="inline-flex items-center justify-center gap-2 rounded-lg border border-primary text-primary px-8 py-4 font-semibold hover:bg-primary/10 transition cursor-pointer">
          Read Documentation
        </button>
      </div>

      <p class="text-sm text-muted-foreground">
        OASMan is fully open source. No cost, no licensing, just pure DIY innovation.
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-border/40 bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-8 md:grid-cols-3 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">OAS</div>
            <span class="font-bold">OASMan</span>
          </div>
          <p class="text-sm text-muted-foreground">Open source DIY air suspension for everyone.</p>
        </div>
        <div class="space-y-3">
          <h4 class="font-semibold">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="https://github.com" class="text-muted-foreground hover:text-foreground transition">GitHub</a></li>
            <li><button class="text-muted-foreground hover:text-foreground transition cursor-pointer">Documentation</button></li>
            <li><button class="text-muted-foreground hover:text-foreground transition cursor-pointer">Community</button></li>
          </ul>
        </div>
        <div class="space-y-3">
          <h4 class="font-semibold">About</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="https://oasman.co" class="text-muted-foreground hover:text-foreground transition">OASMan.co</a></li>
            <li><button class="text-muted-foreground hover:text-foreground transition cursor-pointer">Support</button></li>
            <li><button class="text-muted-foreground hover:text-foreground transition cursor-pointer">Contact</button></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-border/40 pt-8">
        <p class="text-center text-sm text-muted-foreground">
          © 2025 OASMan. Fully open source and community-driven.
        </p>
      </div>
    </div>
  </footer>
</div>
