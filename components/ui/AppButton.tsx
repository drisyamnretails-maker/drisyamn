export default function WelcomePage() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#F6EFE7] flex justify-center">
      {/* IMPORTANT: Max width 400px hi rakha hai — isi se beauty hai. Desktop pe bhi yehi card center me rahega */}
      <div className="w-full max-w-[390px] min-h-[100dvh] flex flex-col px-7 sm:px-8 py-8 bg-[#F6EFE7]">
        
        {/* 1. Logo - Top */}
        <div className="pt-[32px] sm:pt-[48px] flex justify-center">
          <h1 className="font-serif text-[26px] tracking-[0.32em] font-light text-[#0A0A0A]">Tasomi</h1>
        </div>

        {/* Spacer - Logo aur Title ke beech ka bada gap */}
        <div className="flex-[0.8]" />

        {/* 2. Title - Your City, Your Stories */}
        <div className="flex flex-col items-center">
          <h2 className="font-serif font-[700] text-[#0A0A0A] text-center leading-[0.9] tracking-[-0.02em]
                         text-[54px] sm:text-[58px]">
            Your City,<br />Your Stories
          </h2>
        </div>

        {/* Gap - Title aur Description ke beech */}
        <div className="h-[36px]" />

        {/* 3. Description */}
        <div className="flex justify-center px-2">
          <p className="text-center text-[#0A0A0A] font-sans font-[450] leading-[1.55] 
                        text-[16.5px] sm:text-[17px] max-w-[330px]">
            Why Tasomi? Because every local business has a story. We bring cafes, shops, hotels, doctors and creators together in one place where people discover you for who you are, not just what you sell.
          </p>
        </div>

        {/* Spacer - Description aur Buttons ke beech ka sabse bada beautiful gap */}
        <div className="flex-[1.4]" />

        {/* 4. Buttons - Exact same size as your image */}
        <div className="w-full flex flex-col gap-[18px] pb-[24px] sm:pb-[32px]">
          {/* Login - Outline */}
          <button className="w-full h-[62px] rounded-[20px] border border-[#0A0A0A] bg-transparent
                             text-[#0A0A0A] text-[22px] font-[500] tracking-[0.01em]
                             active:scale-[0.98] transition-transform">
            Login
          </button>

          {/* Sign Up - Red */}
          <button className="w-full h-[62px] rounded-[20px] bg-[#D13420] border border-[#D13420]
                             text-white text-[22px] font-[500] tracking-[0.01em]
                             active:scale-[0.98] transition-transform shadow-none">
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}