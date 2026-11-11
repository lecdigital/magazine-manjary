import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Manjary (மஞ்சரி) database...');

  // 1. Seed Users (Admin + Sample Subscribers)
  const adminPasswordHash = await bcrypt.hash('ManjaryAdmin2026!', 10);
  const subscriberPasswordHash = await bcrypt.hash('ReaderPass2026!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@manjary.com' },
    update: {
      name: 'எம். தயாளன் (M. Thayalan)',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      name: 'எம். தயாளன் (M. Thayalan)',
      email: 'admin@manjary.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const subscriber1 = await prisma.user.upsert({
    where: { email: 'kavitha.raman@example.com' },
    update: {},
    create: {
      name: 'கவிதா இராமன் (Kavitha Raman)',
      email: 'kavitha.raman@example.com',
      passwordHash: subscriberPasswordHash,
      role: 'SUBSCRIBER',
    },
  });

  const subscriber2 = await prisma.user.upsert({
    where: { email: 'arun.selvam@example.com' },
    update: {},
    create: {
      name: 'அருண் செல்வம் (Arun Selvam)',
      email: 'arun.selvam@example.com',
      passwordHash: subscriberPasswordHash,
      role: 'SUBSCRIBER',
    },
  });

  // 2. Seed Subscription Plans
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();

  const monthlyPlan = await prisma.subscriptionPlan.create({
    data: {
      nameTa: 'மஞ்சரி வாசகர் - மாதாந்திரத் திட்டம்',
      nameEn: 'Manjary Reader — Monthly Pass',
      descriptionTa: 'ஒவ்வொரு மாதமும் வெளிவரும் மஞ்சரி இலக்கிய இதழ், சிறுகதைகள் மற்றும் தொடர் நாவல்களைத் தடையின்றி வாசிக்க.',
      descriptionEn: 'Full digital access to every monthly issue of Manjary Magazine, serialized novels, and the complete short story archive.',
      perksTa: 'மாதாந்திர மின்-இதழ் (PDF & Web Reader)|எம். தயாளனின் அனைத்துச் சிறுகதைகள் மற்றும் நாவல் அத்தியாயங்கள்|இளம் எழுத்தாளர் படைப்புகளுக்கு முன்னுரிமை வாசிப்பு',
      perksEn: 'Monthly digital magazine issue (PDF & Web Reader)|Complete archive of M. Thayalan short stories & novel chapters|Early access to new aspiring writer spotlights',
      amount: 599, // $5.99
      currency: 'usd',
      billingInterval: 'month',
      stripeProductId: 'prod_manjary_monthly_001',
      stripePriceId: 'price_manjary_monthly_599',
      isActive: true,
      sortOrder: 1,
    },
  });

  const annualPlan = await prisma.subscriptionPlan.create({
    data: {
      nameTa: 'மஞ்சரி புரவலர் - வருடாந்திரத் திட்டம்',
      nameEn: 'Manjary Patron — Annual Membership',
      descriptionTa: 'ஆண்டு முழுவதும் வெளிவரும் 12 இதழ்கள், சிறப்பு மலர்கள் மற்றும் புதிய எழுத்தாளர்களை ஊக்குவிக்கும் இலக்கியப் புரவலர் அங்கீகாரம்.',
      descriptionEn: 'Save 25% with annual access to all 12 issues, special literary annuals, downloadable PDFs, and Patron recognition supporting emerging Tamil writers.',
      perksTa: '12 மாதாந்திர இதழ்கள் + சிறப்பு தீபாவளி/பொங்கல் மலர்கள்|அனைத்து இதழ்களையும் PDF வடிவில் பதிவிறக்கம் செய்யும் வசதி|புதிய எழுத்தாளர்களின் படைப்புப் பட்டறைகளில் பங்கேற்பு|2 மாதங்கள் இலவசச் சலுகை',
      perksEn: 'All 12 monthly issues + Special Annual Literary Editions|Downloadable high-resolution archival PDFs|Invitation to quarterly Tamil writers salon with M. Thayalan|2 months free compared to monthly billing',
      amount: 4900, // $49.00
      currency: 'usd',
      billingInterval: 'year',
      stripeProductId: 'prod_manjary_annual_002',
      stripePriceId: 'price_manjary_annual_4900',
      isActive: true,
      sortOrder: 2,
    },
  });

  const patronPlan = await prisma.subscriptionPlan.create({
    data: {
      nameTa: 'இலக்கியப் புரவலர் & எழுத்தாளர் வழிகாட்டி',
      nameEn: 'Literary Benefactor & Aspiring Writer Circle',
      descriptionTa: 'வளரும் தமிழ் எழுத்தாளர்களின் நூல் வெளியீட்டுக்குத் துணை நிற்கும் சிறப்புப் புரவலர் திட்டம் மற்றும் நேரடி ஆலோசனை.',
      descriptionEn: 'Directly sponsor emerging Tamil authors in Manjary while receiving signed print annuals and editorial feedback sessions.',
      perksTa: 'அனைத்து மின்-இதழ்கள் மற்றும் நாவல் களஞ்சியம்|ஆண்டுக்கு ஒருமுறை எம். தயாளன் கையொப்பமிட்ட சிறப்பு அச்சு மலர்|புதிய எழுத்தாளர்களுக்கான நேரடித் திறனாய்வு மற்றும் வழிகாட்டல்|மஞ்சரி இதழில் புரவலர் பெயர் இடம்பெறுதல்',
      perksEn: 'Complete digital library & archival access|Signed annual print anthology shipped to you|Editorial manuscript feedback session for aspiring writers|Patron credit in every issue of Manjary',
      amount: 12000, // $120.00
      currency: 'usd',
      billingInterval: 'year',
      stripeProductId: 'prod_manjary_benefactor_003',
      stripePriceId: 'price_manjary_benefactor_12000',
      isActive: true,
      sortOrder: 3,
    },
  });

  // 3. Seed Sample Subscriptions
  await prisma.subscription.create({
    data: {
      userId: subscriber1.id,
      planId: annualPlan.id,
      stripeCustomerId: 'cus_sample_kavitha_01',
      stripeSubscriptionId: 'sub_sample_kavitha_annual_01',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 320),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: subscriber2.id,
      planId: monthlyPlan.id,
      stripeCustomerId: 'cus_sample_arun_02',
      stripeSubscriptionId: 'sub_sample_arun_monthly_02',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24),
    },
  });

  // 4. Seed Literary Posts (Short Stories, Novel Chapters, Editorial Articles)
  await prisma.post.deleteMany();

  await prisma.post.createMany({
    data: [
      {
        title: 'மழை நின்ற பிறகும் தூறும் மரங்கள்',
        slug: 'mazhai-nindra-piragum-thoorum-marangal',
        excerpt: 'யாழ்ப்பாணத்து முற்றத்து வேப்பமரத்தடியில் தொடங்கி, புலம்பெயர் நகரத்தின் பனிப்பொழிவு வரை நீளும் நினைவுகளின் ஈரம் குறித்த எம். தயாளனின் மனதை வருடும் சிறுகதை.',
        content: `மழை எப்போதோ நின்றிருந்தது. ஆனால் முற்றத்து வேப்பமரம் மட்டும் தன் இலைகளின் நுனிகளில் சேமித்து வைத்திருந்த நீர்த்துளிகளைக் காற்றின் ஒவ்வொரு அசைவுக்கும் மெல்ல உதிர்த்துக்கொண்டே இருந்தது.

சின்னத்தம்பித் தாத்தா திண்ணையில் சாய்ந்தபடி அந்தச் சொட்டுகளின் தாளத்தையே பார்த்துக்கொண்டிருந்தார். வீட்டுக்குள் இருந்து வந்த தேநீர் கோப்பையின் ஆவி, ஈரக் காற்றோடு கலந்து ஒரு பழைய காலத்தின் வாசனையை எழுப்பியது.

"மழை விட்டாலும் மரம் விடாது பாருங்கோ... மனுச மனசும் அப்படித்தான். காலம் கடந்து போனாலும் சில நினைவுகள் சொட்டிக்கொண்டே இருக்கும்," என்றார் அவர்.

நாற்பது ஆண்டுகளுக்குப் பிறகு தன் சொந்த ஊரின் ஒற்றையடிப் பாதையில் கால் பதித்த கதிர்காமனுக்கு அந்த வார்த்தைகள் தன் நெஞ்சுக்குள்ளேயே விழுந்த மழைத்துளிகளாய் ஒலித்தன. தான் விட்டுச் சென்ற பழைய தபால் நிலையம், பனை ஓலை வேய்ந்த வாசிகசாலை, மாலை நேரங்களில் நண்பர்களோடு கூடிப் பேசிய குளத்தங்கரை—எல்லாமே உருமாறியிருந்தன; ஆனால் மண்ணின் வாசனை மட்டும் மாறவேயில்லை.

வாசிகசாலையின் பழைய மர அலமாரியைத் திறந்தபோது, அங்கே மஞ்சள் பூத்த தாள்களுடன் கூடிய 'மஞ்சரி' கையெழுத்துப் பிரதி ஒன்று இன்னும் பத்திரமாக வைக்கப்பட்டிருந்தது. தான் பதினெட்டு வயதில் எழுதிய முதல் சிறுகதையின் வரிகள், காலத்தின் தூசியைத் தாண்டி இன்னும் உயிரோடு தன்னைப் பார்த்துப் புன்னகைப்பதைக் கண்டான்.

எழுத்து என்பது வெறும் மை அல்ல; அது ஒரு தலைமுறை அடுத்த தலைமுறைக்கு விட்டுச் செல்லும் ஈரம் என்பதை அவன் அன்றுதான் முழுமையாக உணர்ந்தான்.`,
        category: 'SHORT_STORY',
        bookTitle: '',
        chapterNumber: 1,
        authorName: 'எம். தயாளன் (M. Thayalan)',
        language: 'ta',
        readingTimeMinutes: 7,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-10-15T10:00:00Z'),
      },
      {
        title: 'காகிதப் படகுகளின் பெருங்கடல்',
        slug: 'kaagitha-padagugalin-perungadal',
        excerpt: 'எழுதத் துடிக்கும் இளம் மனங்களின் கனவுகளும், முதல் பிரசுரத்திற்காகக் காத்திருக்கும் ஒரு சிற்றிதழ் ஆசிரியரின் போராட்டமும் சந்திக்கும் புள்ளி.',
        content: `அச்சு இயந்திரத்தின் சத்தம் நள்ளிரவு தாண்டியும் அந்தச் சிறிய அறையில் கேட்டுக்கொண்டிருந்தது. மேசை முழுவதும் தமிழ்நாட்டின் பல ஊர்களிலிருந்தும், ஈழத்திலிருந்தும், கடல் கடந்த நாடுகளிலிருந்தும் வந்த தபால் உறைகள் குவிந்து கிடந்தன.

ஒவ்வொரு உறையின் உள்ளேயும் ஒரு புதிய எழுத்தாளரின் தயக்கமும் கனவும் மடித்து வைக்கப்பட்டிருந்தன. சில கதைகள் நேர்த்தியான தட்டச்சில் இருந்தன; சில கதைகள் கோடு போட்ட நோட்டுத் தாள்களில் நீல மையால் எழுதப்பட்டிருந்தன.

ஆசிரியர் தயாளன் தன் மூக்குக் கண்ணாடியைச் சரி செய்துகொண்டு, ஒரு கல்லூரி மாணவி அனுப்பியிருந்த சிறுகதையை வாசிக்கத் தொடங்கினார். முதல் இரண்டு பக்கங்களில் தெரிந்த பதற்றம், மூன்றாவது பக்கத்தில் ஒரு அபூர்வமான கவித்துவமாக மலர்ந்திருந்தது.

"ஒரு புதிய குரல் தமிழுக்குக் கிடைத்துவிட்டது," என்று தனக்குத்தானே முணுமுணுத்துக்கொண்டார். அந்தக் கதையின் ஓரத்தில் 'மஞ்சரி - அடுத்த இதழில்' என்று சிவப்பு மையால் குறிப்பெழுதியபோது, காகிதப் படகொன்று பெருங்கடலில் தன் முதல் பயணத்தைத் தொடங்கிய நிறைவு அவருக்கு ஏற்பட்டது.`,
        category: 'SHORT_STORY',
        bookTitle: '',
        chapterNumber: 1,
        authorName: 'எம். தயாளன் (M. Thayalan)',
        language: 'ta',
        readingTimeMinutes: 6,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-10-28T10:00:00Z'),
      },
      {
        title: 'வேர்களின் கீதம் — அத்தியாயம் 1: பனைமரக் காற்று',
        slug: 'vergalin-geetham-chapter-1',
        excerpt: 'தலைமுறைகளைக் கடந்து வாழும் ஒரு குடும்பத்தின் வரலாற்றுப் புதினம். மண்ணின் மரபும் நவீன காலத்தின் மாற்றங்களும் மோதும் முதல் அத்தியாயம்.',
        content: `ஆடி மாதத்துப் பனைமரக் காற்று ஊரின் தெற்கு எல்லையிலிருந்த பழைமையான ஓட்டு வீட்டின் கூரையை வருடிக்கொண்டு சென்றது. அந்த வீட்டின் நடுக்கூடத்தில் மாட்டப்பட்டிருந்த தாத்தாவின் கருப்பு-வெள்ளைப் புகைப்படத்திற்குக் கீழே, நூறு ஆண்டுகளுக்கும் மேலான பனை ஓலைச் சுவடிகளும் நவீன அச்சுப் புத்தகங்களும் ஒன்றையொன்று பார்த்தபடி அடுக்கப்பட்டிருந்தன.

அருளானந்தம் தன் தந்தையின் நாட்குறிப்பைப் புரட்டத் தொடங்கினார். 1950-களின் தொடக்கத்தில் கொழும்பிலிருந்து யாழ்ப்பாணம் நோக்கிப் பயணித்த இரயில் வண்டியின் சத்தமும், அன்றைய இலக்கியக் கூட்டங்களின் விவாதங்களும் அந்தப் பக்கங்களில் உயிர்த்துடிப்புடன் பதிவாகியிருந்தன.

"நாம் எங்கே செல்கிறோம் என்பதை அறிய, நாம் எங்கிருந்து வந்தோம் என்ற வேரின் மொழியை மறக்கக் கூடாது," என்ற வரி அடிக்கோடிடப்பட்டிருந்தது.

இந்த நாவல், மூன்று தலைமுறைகளின் வழியே பயணிக்கும் ஒரு குடும்பத்தின் கதை மட்டுமல்ல; தமிழ் மொழியின் நவீன இலக்கியப் பயணத்தின் சாட்சியமுமாகும்.`,
        category: 'NOVEL_CHAPTER',
        bookTitle: 'வேர்களின் கீதம் (Song of the Roots)',
        chapterNumber: 1,
        authorName: 'எம். தயாளன் (M. Thayalan)',
        language: 'ta',
        readingTimeMinutes: 10,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-11-01T10:00:00Z'),
      },
      {
        title: 'கால நதியின் கரைகளில் — அத்தியாயம் 1: துறைமுகத்து விளக்குகள்',
        slug: 'kaala-nathiyin-karaigalil-chapter-1',
        excerpt: 'கடல் கடந்த தமிழர்களின் வாழ்வியல், அடையாளத் தேடல் மற்றும் தாய்மொழிப் பற்றினைப் பேசும் எம். தயாளனின் புகழ்பெற்ற நாவலின் தொடக்கம்.',
        content: `துறைமுகத்தின் மஞ்சள் விளக்குகள் கடல் நீரில் நீண்ட தங்கக் கோடுகளாய்ப் பிரதிபலித்துக்கொண்டிருந்தன. கப்பல் புறப்படுவதற்கான முதல் சங்கு ஒலித்தபோது, கையிலிருந்த சிறிய தோல் பெட்டியை இறுக்கப்ற்றிக்கொண்டான் முருகேசன். அந்தப் பெட்டிக்குள் உடைகளை விட அதிகமாக இருந்தது அவன் சேகரித்த தமிழ்ப் புத்தகங்கள்தான்.

புதிய தேசம், புதிய மொழி, புதிய மனிதர்கள்—ஆனால் இரவுகளில் அவனுக்குத் துணை நின்றது தாய்மொழியின் எழுத்துகள் மட்டுமே. தன் அறையின் சிறிய மேசையில் அமர்ந்து அவன் எழுதத் தொடங்கிய கடிதங்கள், பின்னாளில் ஒரு பெரும் இலக்கிய இயக்கத்தின் விதைகளாக மாறப்போவதை அன்று அவன் அறிந்திருக்கவில்லை.`,
        category: 'NOVEL_CHAPTER',
        bookTitle: 'கால நதியின் கரைகளில் (On the Banks of the River of Time)',
        chapterNumber: 1,
        authorName: 'எம். தயாளன் (M. Thayalan)',
        language: 'ta',
        readingTimeMinutes: 9,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date('2026-11-04T10:00:00Z'),
      },
      {
        title: 'மஞ்சரியின் நோக்கம்: புதிய எழுத்தாளர்களுக்கான திறந்த வாசல்',
        slug: 'manjary-editorial-mission-new-writers',
        excerpt: 'எழுதத் தயங்கும் இளம் படைப்பாளிகளை அடையாளம் கண்டு, அவர்களின் படைப்புகளைச் செதுக்கி உலகத் தமிழ் வாசகர்களிடம் கொண்டு சேர்க்கும் மஞ்சரியின் இலக்கியப் பணி.',
        content: `தமிழ் இலக்கிய உலகிற்கு எப்போதும் புதிய குரல்களின் தேவை இருந்துகொண்டே இருக்கிறது. எழுதும் ஆர்வம் இருந்தும், தங்கள் படைப்புகளை எங்கே வெளியிடுவது, யாரிடம் ஆலோசனை பெறுவது என்றுத் தெரியாமல் தயங்கி நிற்கும் நூற்றுக்கணக்கான இளம் எழுத்தாளர்களை நான் சந்தித்திருக்கிறேன்.

அந்தத் தயக்கத்தை உடைத்து, ஒவ்வொரு புதிய படைப்பாளிக்கும் ஒரு நம்பிக்கையான களம் அமைத்துக் கொடுப்பதற்காகவே 'மஞ்சரி' (Manjary) தொடங்கப்பட்டது.

மஞ்சரி வெறும் இதழ் மட்டுமல்ல; அது ஒரு இலக்கியப் பட்டறை. இங்கே மூத்த எழுத்தாளர்களின் படைப்புகளுக்கு அருகிலேயே, முதன்முறையாக எழுதும் ஒரு புதிய எழுத்தாளரின் சிறுகதையோ கவிதையோ சம மரியாதையுடன் பிரசுரிக்கப்படுகிறது.

உங்கள் மனதில் ஒரு கதை இருந்தால், தயங்காமல் எழுதுங்கள். மஞ்சரியின் வாசல்கள் உங்களுக்காக எப்போதும் திறந்தே இருக்கின்றன.

— அன்புடன், எம். தயாளன்`,
        category: 'ARTICLE',
        bookTitle: '',
        chapterNumber: 1,
        authorName: 'எம். தயாளன் (M. Thayalan)',
        language: 'ta',
        readingTimeMinutes: 4,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-11-08T10:00:00Z'),
      },
    ],
  });

  // 5. Seed Magazine Issues
  await prisma.magazineIssue.deleteMany();

  await prisma.magazineIssue.createMany({
    data: [
      {
        issueNumber: 14,
        month: 'நவம்பர் (November)',
        year: 2026,
        title: 'புதிய தலைமுறை சிறுகதைச் சிறப்பிதழ்',
        subtitle: 'இளம் எழுத்தாளர்களின் 12 புதிய சிறுகதைகள் & எம். தயாளனின் தொடர் நாவல்',
        description: 'உலகெங்கும் வாழும் புதிய தமிழ் எழுத்தாளர்களின் தேர்ந்தெடுக்கப்பட்ட சிறுகதைகள், இலக்கியத் திறனாய்வுக் கட்டுரைகள் மற்றும் வேர்களின் கீதம் நாவலின் சிறப்பு அத்தியாயம் அடங்கிய இதழ்.',
        highlights: 'எம். தயாளனின் ஆசிரியர் தலையங்கம்|புதிய எழுத்தாளர்கள் 12 பேரின் அறிமுகச் சிறுகதைகள்|நவீன தமிழ்ச் சிறுகதை வடிவங்கள் - சிறப்புக் கட்டுரை|வேர்களின் கீதம் - தொடர் நாவல்',
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
        pdfUrl: '/sample-issues/manjary-issue-14.pdf',
        isPublished: true,
      },
      {
        issueNumber: 13,
        month: 'அக்டோபர் (October)',
        year: 2026,
        title: 'புலம்பெயர் இலக்கியப் பதிவுகள்',
        subtitle: 'கடல் கடந்த தமிழ் வாழ்வியலும் நினைவுகளின் இலக்கியமும்',
        description: 'புலம்பெயர் தமிழர்களின் வாழ்வியல் அனுபவங்கள், தாய்மொழிப் பற்று மற்றும் பண்பாட்டுத் தொடர்ச்சியைப் பேசும் படைப்புகளின் தொகுப்பு.',
        highlights: 'மழை நின்ற பிறகும் தூறும் மரங்கள் - சிறுகதை|புலம்பெயர் கவிதைகள் தொகுப்பு|வாசகர் கடிதங்களும் இலக்கிய உரையாடலும்',
        coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
        pdfUrl: '/sample-issues/manjary-issue-13.pdf',
        isPublished: true,
      },
      {
        issueNumber: 12,
        month: 'செப்டம்பர் (September)',
        year: 2026,
        title: 'மஞ்சரி ஆண்டு மலர் — இலக்கியப் பயணம்',
        subtitle: 'ஓராண்டு நிறைவுச் சிறப்பு மலர் மற்றும் விருது பெற்ற சிறுகதைகள்',
        description: 'மஞ்சரி இதழின் முதலாம் ஆண்டு நிறைவைக் கொண்டாடும் வகையில் வெளியிடப்பட்ட 160 பக்கச் சிறப்பு மலர்.',
        highlights: 'சிறந்த இளம் எழுத்தாளர் விருது பெற்ற கதைகள்|எம். தயாளனின் நேர்காணல்|தமிழ்ச் சிற்றிதழ் வரலாறு - ஆவணப் பதிவு',
        coverImageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
        pdfUrl: '/sample-issues/manjary-issue-12.pdf',
        isPublished: true,
      },
    ],
  });

  console.log('✅ Seeding completed! Admin login: admin@manjary.com / ManjaryAdmin2026!');
  console.log(`👤 Admin User ID: ${adminUser.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

