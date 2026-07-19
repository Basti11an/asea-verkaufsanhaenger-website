import svgPaths from "./svg-r1joc92mq4";
import imgTrailerScene from "figma:asset/02675001fbefbda6285231d3331f4b570a2e5c4c.png";

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#2e3c45] text-[30px] top-[-1.6px] whitespace-nowrap">{`Modelle & Konfigurator`}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-2.2px] whitespace-nowrap">Planen Sie Ihren individuellen Verkaufsanhänger in 3D.</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[60px] relative shrink-0 w-[1087.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[32px] min-h-px min-w-px not-italic relative text-[24px] text-white">Konfigurator</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[-0.2px] whitespace-nowrap">Stellen Sie Ihren Anhänger zusammen</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#2e3c45] h-[103.988px] relative shrink-0 w-[382.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_72_524)" id="Icon">
          <path d={svgPaths.p13a75f00} fill="var(--fill-0, #6A7282)" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3359640} fill="var(--fill-0, #6A7282)" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2041a800} fill="var(--fill-0, #6A7282)" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1e291080} fill="var(--fill-0, #6A7282)" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120b5900} id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_72_524">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[24px] not-italic text-[#6a7282] text-[14px] top-[-0.2px] tracking-[0.7px] uppercase whitespace-nowrap">{` Außenfarbe`}</p>
    </div>
  );
}

function Button() {
  return <div className="absolute bg-white border-[#2e3c45] border-[1.6px] border-solid left-[-2.4px] rounded-[26843500px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] size-[52.8px] top-[-2.4px]" data-name="Button" />;
}

function Button1() {
  return <div className="absolute bg-[#1c1f2b] border-[#e5e7eb] border-[1.6px] border-solid left-[64px] rounded-[26843500px] size-[48px] top-0" data-name="Button" />;
}

function Button2() {
  return <div className="absolute bg-[#b7d3e9] border-[#e5e7eb] border-[1.6px] border-solid left-[128px] rounded-[26843500px] size-[48px] top-0" data-name="Button" />;
}

function Button3() {
  return <div className="absolute bg-[#d1d5db] border-[#e5e7eb] border-[1.6px] border-solid left-[192px] rounded-[26843500px] size-[48px] top-0" data-name="Button" />;
}

function Container5() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container5 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[24px] not-italic text-[#6a7282] text-[14px] top-[-0.2px] tracking-[0.7px] uppercase whitespace-nowrap">{` Ausstattung`}</p>
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p9daf320} id="Vector_3" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(183,211,233,0.2)] relative rounded-[16px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[208.8px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1c1f2b] text-[16px] top-[-2.2px] whitespace-nowrap">Profi Kaffeemaschine</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[24.2px] whitespace-nowrap">+ 2.500 €</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[81.6px] relative rounded-[16px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16.8px] py-[0.8px] relative size-full">
          <Checkbox />
          <Container8 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Checkbox1() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1510280} id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1d87ff80} id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p15c06100} id="Vector_3" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p38fb8b98} id="Vector_4" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p211e8380} id="Vector_5" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p352d0080} id="Vector_6" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2cd6e00} id="Vector_7" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p78a12c0} id="Vector_8" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33bdd00} id="Vector_9" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p23fbbf00} id="Vector_10" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p312f8180} id="Vector_11" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e209cc0} id="Vector_12" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(183,211,233,0.2)] relative rounded-[16px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[208.8px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1c1f2b] text-[16px] top-[-2.2px] whitespace-nowrap">Getränkekühlschrank</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text1 />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[24.2px] whitespace-nowrap">+ 800 €</p>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[81.6px] relative rounded-[16px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16.8px] py-[0.8px] relative size-full">
          <Checkbox1 />
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Checkbox2() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1ecd6152} id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17796300} id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[rgba(183,211,233,0.2)] relative rounded-[16px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[208.8px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1c1f2b] text-[16px] top-[-2.2px] whitespace-nowrap">Waschbecken-Set</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text2 />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[24.2px] whitespace-nowrap">+ 450 €</p>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[81.6px] relative rounded-[16px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16.8px] py-[0.8px] relative size-full">
          <Checkbox2 />
          <Container12 />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[268.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Label1 />
      <Label2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[304.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container7 />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[382.4px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start pt-[24px] px-[24px] relative size-full">
          <Container4 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[124.313px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-0.2px] whitespace-nowrap">Gesamtpreis (Netto)</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[60px] relative shrink-0 w-[124.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text3 />
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#2e3c45] text-[30px] top-[19.4px] whitespace-nowrap">8.500 €</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end justify-between pr-[210.087px] relative size-full">
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#b7d3e9] h-[56px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[167.2px] not-italic text-[#1c1f2b] text-[16px] text-center top-[13.8px] whitespace-nowrap">Angebot anfordern</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#f9fafb] h-[188.8px] relative shrink-0 w-[382.4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pt-[24.8px] px-[24px] relative size-full">
        <Container15 />
        <Button4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-white h-[763.188px] left-[703.2px] rounded-[24px] top-0 w-[384px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.8px] relative rounded-[inherit] size-full">
        <Container2 />
        <Container3 />
        <Container14 />
      </div>
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function TrailerScene() {
  return (
    <div className="absolute h-[763px] left-0 top-0 w-[679px]" data-name="TrailerScene">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgTrailerScene} />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_72_515)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_72_515">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2e3c45] text-[14px] top-[-0.2px] whitespace-nowrap">Klicken Sie auf Klappen/Türen zum Öffnen</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.7)] content-stretch flex gap-[8px] h-[37.6px] items-center left-[24px] px-[16.8px] py-[0.8px] rounded-[26843500px] top-[24px] w-[325.35px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1910bd80} id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 16.6667H18.3333" id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 10V10.0083" id="Vector_3" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[16px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon6 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[99.5px] not-italic text-[#2e3c45] text-[16px] text-center top-[9.8px] whitespace-nowrap">Verkaufsklappe</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1910bd80} id="Vector" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 16.6667H18.3333" id="Vector_2" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 10V10.0083" id="Vector_3" stroke="var(--stroke-0, #2E3C45)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[48px] relative rounded-[16px] shrink-0 w-[134.813px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon7 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[81px] not-italic text-[#2e3c45] text-[16px] text-center top-[9.8px] whitespace-nowrap">Hecktüren</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.7)] content-stretch flex gap-[16px] h-[73.6px] items-start left-[165.96px] pb-[0.8px] pt-[12.8px] px-[12.8px] rounded-[16px] top-[665.59px] w-[347.288px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[763.188px] left-0 overflow-clip rounded-[24px] top-0 w-[679.2px]" data-name="Container" style={{ backgroundImage: "linear-gradient(131.668deg, rgb(243, 244, 246) 0%, rgb(229, 231, 235) 100%)" }}>
      <TrailerScene />
      <Container18 />
      <Container19 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function TrailerConfigurator() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1087.2px]" data-name="TrailerConfigurator">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container1 />
        <Container17 />
      </div>
    </div>
  );
}

function Models() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1151.2px]" data-name="Models">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pl-[32px] py-[32px] relative size-full">
        <Container />
        <TrailerConfigurator />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1151.2px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[64px] relative size-full">
        <Models />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="absolute bg-[#f5f7fa] content-stretch flex flex-col h-[729.6px] items-start left-0 pb-[-245.587px] top-0 w-[1151.2px]" data-name="MainLayout">
      <MainContent />
    </div>
  );
}

function Link() {
  return (
    <div className="h-[31.988px] relative shrink-0 w-[66.838px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#2e3c45] text-[24px] whitespace-nowrap">
          <span className="leading-[32px]">ASEA</span>
          <span className="leading-[32px] text-[#b7d3e9]">.</span>
        </p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[65.363px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(28,31,43,0.7)] top-[5.8px] whitespace-nowrap">Startseite</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[63.612px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(28,31,43,0.7)] top-[5.8px] whitespace-nowrap">Über uns</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[59.35px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#b7d3e9] border-b-[1.6px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#2e3c45] text-[16px] top-[5.8px] whitespace-nowrap">Modelle</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[54.263px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(28,31,43,0.7)] top-[5.8px] whitespace-nowrap">Kontakt</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[46.463px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(28,31,43,0.7)] top-[5.8px] whitespace-nowrap">Admin</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[417.05px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-start relative size-full">
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
        <Link5 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Link />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.7)] content-stretch flex flex-col h-[64.8px] items-start left-0 pb-[0.8px] px-[32px] top-0 w-[1151.2px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.2)] border-b-[0.8px] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Container20 />
    </div>
  );
}

export default function AseaWebsiteRedi2Kopie() {
  return (
    <div className="bg-white relative size-full" data-name="ASEA Website Redi 2 (Kopie)">
      <MainLayout />
      <Navbar />
    </div>
  );
}