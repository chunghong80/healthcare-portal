/**
 * Health Info Archive Management Module (health_archive.js)
 * Manages 3-Tier Hierarchical Categories, Archive posts, and Video Archive.
 * Utilizes localStorage keys: hc_archive_categories, hc_archive_posts, hc_archive_videos.
 */

// -------------------------------------------------------------
// INITIALIZE HIERARCHICAL SEED DATA (v2)
// -------------------------------------------------------------
(function initArchiveSeedData() {
  if (!localStorage.getItem('hc_archive_categories') || !localStorage.getItem('hc_archive_categories_v3')) {
    const defaultCats = {
      // Large Categories (대분류)
      "cat_large_1": { id: "cat_large_1", label: "만성질환", level: "large", parentId: null, sortOrder: 1, status: "사용함", memo: "고객에게 유용한 만성질환 관리 가이드", regDate: "2026-06-01 10:00" },
      "cat_large_2": { id: "cat_large_2", label: "운동/신체활동", level: "large", parentId: null, sortOrder: 2, status: "사용함", memo: "신체활동 증진 및 부위별 정렬 운동법", regDate: "2026-06-01 10:05" },
      "cat_large_3": { id: "cat_large_3", label: "스트레스/명상케어", level: "large", parentId: null, sortOrder: 3, status: "사용함", memo: "직장인 심리 안정 및 마인드풀니스 요가", regDate: "2026-06-01 10:10" },
      
      // Medium Categories (중분류)
      "cat_med_1_1": { id: "cat_med_1_1", label: "당뇨", level: "medium", parentId: "cat_large_1", sortOrder: 1, status: "사용함", memo: "당뇨 자가관리 및 수치 모니터링", regDate: "2026-06-01 10:15" },
      "cat_med_1_2": { id: "cat_med_1_2", label: "고혈압", level: "medium", parentId: "cat_large_1", sortOrder: 2, status: "사용함", memo: "혈압 조절 및 식이 가이드라인", regDate: "2026-06-01 10:20" },
      "cat_med_2_1": { id: "cat_med_2_1", label: "유산소 운동", level: "medium", parentId: "cat_large_2", sortOrder: 1, status: "사용함", memo: "심폐기능 향상 및 유산소 스포츠", regDate: "2026-06-01 10:25" },
      "cat_med_2_2": { id: "cat_med_2_2", label: "근력 운동", level: "medium", parentId: "cat_large_2", sortOrder: 2, status: "사용함", memo: "근육 강화 및 전신 저항성 트레이닝", regDate: "2026-06-01 10:30" },
      "cat_med_3_1": { id: "cat_med_3_1", label: "마음챙김 명상", level: "medium", parentId: "cat_large_3", sortOrder: 1, status: "사용함", memo: "정서 완화용 싱잉볼 사운드 및 가이드", regDate: "2026-06-01 10:35" },
      
      // Small Categories (소분류)
      "cat_small_1_1_1": { id: "cat_small_1_1_1", label: "식사관리", level: "small", parentId: "cat_med_1_1", sortOrder: 1, status: "사용함", memo: "당뇨 환자 저탄수화물 식이 및 레시피", regDate: "2026-06-01 10:40" },
      "cat_small_1_1_2": { id: "cat_small_1_1_2", label: "운동관리", level: "small", parentId: "cat_med_1_1", sortOrder: 2, status: "사용함", memo: "식후 거북목 탈출 및 5분 스트레칭", regDate: "2026-06-01 10:45" },
      "cat_small_1_1_3": { id: "cat_small_1_1_3", label: "혈당관리", level: "small", parentId: "cat_med_1_1", sortOrder: 3, status: "사용함", memo: "혈당 기록법 및 자가 진단 가이드", regDate: "2026-06-01 10:48" },
      "cat_small_1_2_1": { id: "cat_small_1_2_1", label: "허리디스크 스트레칭", level: "small", parentId: "cat_med_1_2", sortOrder: 1, status: "사용함", memo: "요추 안정화 스트레칭 운동", regDate: "2026-06-01 10:50" },
      "cat_small_2_1_1": { id: "cat_small_2_1_1", label: "고혈압 식단", level: "small", parentId: "cat_med_2_1", sortOrder: 1, status: "사용함", memo: "고혈압 환자를 위한 2주 저염 식단", regDate: "2026-06-01 10:55" },
      "cat_small_2_2_1": { id: "cat_small_2_2_1", label: "당뇨병 관리 식단", level: "small", parentId: "cat_med_2_2", sortOrder: 1, status: "사용함", memo: "당뇨 특화 맞춤 가이드", regDate: "2026-06-01 11:00" },
      "cat_small_3_1_1": { id: "cat_small_3_1_1", label: "숙면 싱잉볼 요가", level: "small", parentId: "cat_med_3_1", sortOrder: 1, status: "사용함", memo: "릴렉스 숙면 요가 가이드", regDate: "2026-06-01 11:05" },
      "cat_small_3_1_2": { id: "cat_small_3_1_2", label: "직장인 5분 명상", level: "small", parentId: "cat_med_3_1", sortOrder: 2, status: "사용함", memo: "간편 사무실 명상", regDate: "2026-06-01 11:10" }
    };
    localStorage.setItem('hc_archive_categories', JSON.stringify(defaultCats));
    localStorage.setItem('hc_archive_categories_v2', 'true');
    localStorage.setItem('hc_archive_categories_v3', 'true');
  }

  // 2. Archive posts seed
  if (!localStorage.getItem('hc_archive_posts') || !localStorage.getItem('hc_archive_posts_v3')) {
    const defaultPosts = [
      {
        id: "post_1",
        catId: "cat_small_1_2_1",
        title: "허리디스크 환자를 위한 자가 재활 스트레칭 교안",
        content: "가정에서 쉽게 따라 할 수 있는 허리디스크 요추 안정화 운동과 골반 정렬 스트레칭 가이드입니다. 무리가 가지 않는 선에서 하루 3회 정기적으로 수행할 것을 권장합니다.",
        fileName: "spinal_rehab_guide_2026.pdf",
        fileSize: 3840120, // 3.66 MB
        fileData: "data:application/pdf;base64,JVBERi0xLjQK...",
        status: "Y",
        views: 120,
        regDate: "2026-06-02 11:30"
      },
      {
        id: "post_2",
        catId: "cat_small_2_1_1",
        title: "고혈압 환자를 위한 2주 저염 식단 가이드북 (레시피 포함)",
        content: "영양관리팀에서 추천하는 혈압 조절 식사 가이드라인과 나트륨 섭취를 최소화하는 건강 레시피 모음입니다. PDF 문서를 내려받아 부엌에 비치해 활용해 보세요.",
        fileName: "hypertension_diet_recipe.pdf",
        fileSize: 4520110, // 4.31 MB
        fileData: "data:application/pdf;base64,JVBERi0xLjQK...",
        status: "Y",
        views: 84,
        regDate: "2026-06-03 14:15"
      }
    ];
    localStorage.setItem('hc_archive_posts', JSON.stringify(defaultPosts));
    localStorage.setItem('hc_archive_posts_v2', 'true');
    localStorage.setItem('hc_archive_posts_v3', 'true');
  }

  // 3. Video Archive seed
  if (!localStorage.getItem('hc_archive_videos') || !localStorage.getItem('hc_archive_videos_v3')) {
    const defaultVideos = [
      {
        id: "vid_1",
        catId: "cat_small_1_1_2", // 운동관리
        title: "[재활] 목디스크 예방! 사무실 거북목 탈출 5분 스트레칭",
        description: "사무실 의자에 앉아 거북목과 굽은 어깨를 일자로 펴주는 5분짜리 초간단 릴렉스 교정 영상입니다.",
        keywords: "건강, 운동, 거북목, 오피스스트레칭",
        exposure: "노출",
        status: "게시",
        writer: "신은준 (eunjoon@gyobo.com)",
        regDate: "2026-06-04 09:00",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90'><rect width='100%' height='100%' fill='%23eff6ff'/><circle cx='80' cy='45' r='20' fill='%232563eb' opacity='0.8'/><polygon points='75,35 75,55 92,45' fill='white'/><text x='10' y='20' fill='%231e3a8a' font-size='10' font-weight='bold'>거북목 교정</text></svg>",
        altText: "거북목 교정 썸네일 이미지",
        videoName: "turtle_neck_rehab_5m.mp4",
        videoSize: 48900120, // 46.6 MB
        videoData: "mock_blob_url",
        duration: "00:05:12",
        subtitleName: "turtle_neck_rehab_ko.srt",
        attachmentName: "turtle_neck_manual.pdf",
        autoplay: "미사용",
        loop: "미사용",
        download: "비허용",
        progressbar: "표시",
        views: 242
      },
      {
        id: "vid_2",
        catId: "cat_small_3_1_1", // 숙면 싱잉볼 요가
        title: "[명상] 불면증 해소를 위한 릴렉스 숙면 싱잉볼 요가 사운드",
        description: "마음의 긴장을 완화하고 깊은 수면에 빠질 수 있도록 도와주는 천연 싱잉볼 테라피 배경음악입니다.",
        keywords: "명상, 숙면, 불면증, 요가",
        exposure: "노출",
        status: "게시",
        writer: "김아름 (arum@gyobo.com)",
        regDate: "2026-06-05 17:00",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90'><rect width='100%' height='100%' fill='%23faf5ff'/><circle cx='80' cy='45' r='20' fill='%237c3aed' opacity='0.8'/><polygon points='75,35 75,55 92,45' fill='white'/><text x='10' y='20' fill='%234c1d95' font-size='10' font-weight='bold'>숙면 싱잉볼</text></svg>",
        altText: "숙면 싱잉볼 요가 사운드 썸네일",
        videoName: "singing_bowl_sleeping_30m.mp4",
        videoSize: 258900120, // 246.9 MB
        videoData: "mock_blob_url",
        duration: "00:30:00",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 185
      },
      {
        id: "asmr_1",
        catId: "cat_small_3_1_1",
        title: "숲속 계곡물 소리",
        description: "울창한 숲속 맑은 계곡물이 흐르는 청량하고 맑은 자연의 소리입니다. 스트레스 완화와 지친 마음의 휴식을 위해 감상해 보세요.",
        keywords: "스트레스완화, 마음의휴식, 집중력향상, 자연의소리",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:00",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23115e59'/><stop offset='100%' stop-color='%23047857'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><path d='M0,130 C80,100 160,160 240,120 C280,100 300,110 320,105 L320,180 L0,180 Z' fill='%230f766e' opacity='0.5'/><path d='M0,150 C60,130 120,170 180,140 C240,110 280,160 320,135 L320,180 L0,180 Z' fill='%2314b8a6' opacity='0.3'/><circle cx='260' cy='60' r='18' fill='%23fef08a' opacity='0.15'/><text x='20' y='30' fill='%23ccfbf1' font-size='12' font-weight='bold' opacity='0.8'>Forest Stream</text></svg>",
        altText: "숲속 계곡물 소리 썸네일",
        videoName: "forest_stream_asmr.mp4",
        videoSize: 72400120,
        videoData: "mock_blob_url",
        duration: "00:05:12",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 342
      },
      {
        id: "asmr_2",
        catId: "cat_small_3_1_1",
        title: "빗소리와 창가 풍경",
        description: "창가에 부딪히는 차분한 빗소리와 함께 아늑한 실내 분위기를 연출하는 소리입니다. 불면증 해소와 숙면에 큰 도움을 줍니다.",
        keywords: "스트레스완화, 숙면, 마음의휴식, 빗소리",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:05",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231e1b4b'/><stop offset='100%' stop-color='%23311042'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><line x1='120' y1='0' x2='120' y2='180' stroke='%23312e81' stroke-width='3' opacity='0.7'/><line x1='0' y1='90' x2='320' y2='90' stroke='%23312e81' stroke-width='3' opacity='0.7'/><g stroke='%23a5b4fc' stroke-width='1' opacity='0.3'><line x1='50' y1='20' x2='40' y2='50'/><line x1='180' y1='30' x2='170' y2='60'/><line x1='90' y1='110' x2='80' y2='140'/><line x1='260' y1='100' x2='250' y2='130'/></g><text x='20' y='30' fill='%23e0e7ff' font-size='12' font-weight='bold' opacity='0.8'>Rainy Window</text></svg>",
        altText: "빗소리와 창가 풍경 썸네일",
        videoName: "rainy_window_asmr.mp4",
        videoSize: 68400120,
        videoData: "mock_blob_url",
        duration: "00:04:58",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 189
      },
      {
        id: "asmr_3",
        catId: "cat_small_3_1_1",
        title: "잔잔한 파도 소리",
        description: "일몰이 비치는 해변에 부드럽게 밀려오는 파도 소리입니다. 머릿속의 복잡한 생각들을 지우고 깊은 이완 상태로 인도합니다.",
        keywords: "스트레스완화, 마음의휴식, 숙면, 파도",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:10",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%23ea580c'/><stop offset='40%' stop-color='%231e3a8a'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><circle cx='160' cy='70' r='25' fill='%23fdba74' opacity='0.8'/><path d='M0,120 Q80,105 160,120 T320,120 L320,180 L0,180 Z' fill='%231e40af' opacity='0.6'/><path d='M0,140 Q80,130 160,145 T320,140 L320,180 L0,180 Z' fill='%231d4ed8' opacity='0.4'/><text x='20' y='30' fill='%23ffedd5' font-size='12' font-weight='bold' opacity='0.8'>Ocean Waves</text></svg>",
        altText: "잔잔한 파도 소리 썸네일",
        videoName: "ocean_waves_asmr.mp4",
        videoSize: 81400120,
        videoData: "mock_blob_url",
        duration: "00:05:00",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 312
      },
      {
        id: "asmr_4",
        catId: "cat_small_3_1_1",
        title: "싱잉볼 명상 사운드",
        description: "싱잉볼의 은은하고 깊은 공명음이 몸과 마음의 주파수를 맞춰 안정감을 선사합니다. 명상 및 요가 시간에 최적입니다.",
        keywords: "마음의휴식, 명상, 정서안정, 집중력향상",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:15",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%234c1d95'/><stop offset='100%' stop-color='%231e1b4b'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g4)'/><path d='M100,130 Q160,100 220,130 Q230,160 210,170 Q160,180 110,170 Q90,160 100,130 Z' fill='%23b45309' stroke='%23f59e0b' stroke-width='2' opacity='0.8'/><circle cx='160' cy='75' r='10' fill='%23f59e0b' opacity='0.9'/><path d='M160,65 Q170,45 160,25 Q150,45 160,65 Z' fill='%23ef4444' opacity='0.8'/><text x='20' y='30' fill='%23f3e8ff' font-size='12' font-weight='bold' opacity='0.8'>Singing Bowl Meditation</text></svg>",
        altText: "싱잉볼 명상 사운드 썸네일",
        videoName: "singing_bowl_asmr.mp4",
        videoSize: 76400120,
        videoData: "mock_blob_url",
        duration: "00:05:16",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 295
      },
      {
        id: "asmr_5",
        catId: "cat_small_3_1_1",
        title: "햇살 가득 숲속 새소리",
        description: "아침 햇살이 내리쬐는 평화로운 숲속에서 들려오는 아름다운 산새들의 지저귐 소리입니다. 활기찬 하루의 시작이나 집중력 향상에 좋습니다.",
        keywords: "스트레스완화, 마음의휴식, 자연의소리, 새소리",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:20",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23065f46'/><stop offset='100%' stop-color='%2310b981'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g5)'/><g stroke='%23fef08a' stroke-width='1' opacity='0.3'><line x1='0' y1='0' x2='120' y2='180'/><line x1='50' y1='0' x2='200' y2='180'/><line x1='150' y1='0' x2='280' y2='180'/></g><path d='M60,110 Q90,90 120,110 Q110,130 90,135 Z' fill='%23047857'/><text x='20' y='30' fill='%23d1fae5' font-size='12' font-weight='bold' opacity='0.8'>Forest Birds</text></svg>",
        altText: "햇살 가득 숲속 새소리 썸네일",
        videoName: "forest_birds_asmr.mp4",
        videoSize: 64400120,
        videoData: "mock_blob_url",
        duration: "00:04:45",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 198
      },
      {
        id: "asmr_6",
        catId: "cat_small_3_1_1",
        title: "따뜻한 벽난로 소리",
        description: "장작이 타오르는 소리와 아늑한 벽난로의 온기가 전해지는 편안한 배경음입니다. 긴장 해소와 스트레스 완화에 좋습니다.",
        keywords: "숙면, 마음의휴식, 스트레스완화, 백색소음",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:25",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g6' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%237c2d12'/><stop offset='100%' stop-color='%231e0f0b'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g6)'/><rect x='80' y='60' width='160' height='120' fill='%231c1917' rx='8'/><path d='M120,180 L140,130 L180,130 L200,180' stroke='%2378350f' stroke-width='8' fill='none'/><path d='M160,160 Q180,120 160,90 Q140,120 160,160 Z' fill='%23ea580c' opacity='0.9'/><text x='20' y='30' fill='%23ffedd5' font-size='12' font-weight='bold' opacity='0.8'>Cozy Fireplace</text></svg>",
        altText: "따뜻한 벽난로 소리 썸네일",
        videoName: "fireplace_asmr.mp4",
        videoSize: 85400120,
        videoData: "mock_blob_url",
        duration: "00:05:03",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 265
      },
      {
        id: "asmr_7",
        catId: "cat_small_3_1_1",
        title: "별이 빛나는 밤 숲 소리",
        description: "고요한 깊은 밤 숲속에서 울려 퍼지는 풀벌레 소리와 부드러운 밤바람 소리입니다. 잡념을 없애고 숙면에 들 수 있게 돕습니다.",
        keywords: "숙면, 마음의휴식, 자연의소리, 밤풍경",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:30",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g7' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%230f172a'/><stop offset='100%' stop-color='%231e1b4b'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g7)'/><circle cx='40' cy='40' r='1.5' fill='white'/><circle cx='180' cy='50' r='1.5' fill='white'/><circle cx='270' cy='30' r='1' fill='white'/><circle cx='100' cy='80' r='1' fill='white'/><circle cx='230' cy='70' r='2' fill='white'/><path d='M250,60 C240,40 220,50 210,30 C225,25 245,35 250,60 Z' fill='%23fef08a' opacity='0.95'/><text x='20' y='30' fill='%23e0e7ff' font-size='12' font-weight='bold' opacity='0.8'>Starry Night Forest</text></svg>",
        altText: "별이 빛나는 밤 숲 소리 썸네일",
        videoName: "starry_night_asmr.mp4",
        videoSize: 79400120,
        videoData: "mock_blob_url",
        duration: "00:05:07",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 220
      },
      {
        id: "asmr_8",
        catId: "cat_small_3_1_1",
        title: "카페 백색소음 (집중 모드)",
        description: "카페 특유의 백색소음과 함께 흐르는 잔잔한 배경음악으로, 학업이나 업무 중 집중력을 극대화할 수 있는 사운드입니다.",
        keywords: "집중력향상, 업무·공부, 백색소음, 카페소음",
        exposure: "노출",
        status: "게시",
        writer: "마음케어팀",
        regDate: "2026-06-09 10:35",
        thumb: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><defs><linearGradient id='g8' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2378350f'/><stop offset='100%' stop-color='%23451a03'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g8)'/><path d='M110,130 L210,130 C200,165 120,165 110,130 Z' fill='%23fafaf9' stroke='%23d6d3d1' stroke-width='2'/><path d='M210,135 Q225,135 220,148 Q215,155 205,152' fill='none' stroke='%23d6d3d1' stroke-width='3'/><path d='M140,110 Q145,95 150,110 Q155,95 160,110 Q165,95 170,110' fill='none' stroke='%23d6d3d1' stroke-width='2' opacity='0.7'/><text x='20' y='30' fill='%23fef3c7' font-size='12' font-weight='bold' opacity='0.8'>Cafe Ambience</text></svg>",
        altText: "카페 백색소음 썸네일",
        videoName: "cafe_ambience_asmr.mp4",
        videoSize: 70400120,
        videoData: "mock_blob_url",
        duration: "00:05:21",
        subtitleName: "",
        attachmentName: "",
        autoplay: "미사용",
        loop: "사용",
        download: "비허용",
        progressbar: "표시",
        views: 388
      }
    ];
    localStorage.setItem('hc_archive_videos', JSON.stringify(defaultVideos));
    localStorage.setItem('hc_archive_videos_v2', 'true');
    localStorage.setItem('hc_archive_videos_v3', 'true');
  }
})();

// -------------------------------------------------------------
// DATA ACCESSORS
// -------------------------------------------------------------
function getArchiveCategories() {
  return JSON.parse(localStorage.getItem('hc_archive_categories') || '{}');
}
function saveArchiveCategories(cats) {
  localStorage.setItem('hc_archive_categories', JSON.stringify(cats));
}
function getArchivePosts() {
  return JSON.parse(localStorage.getItem('hc_archive_posts') || '[]');
}
function saveArchivePosts(posts) {
  localStorage.setItem('hc_archive_posts', JSON.stringify(posts));
}
function getArchiveVideos() {
  return JSON.parse(localStorage.getItem('hc_archive_videos') || '[]');
}
function saveArchiveVideos(vids) {
  localStorage.setItem('hc_archive_videos', JSON.stringify(vids));
}

// SubTab View State ("category" | "archive" | "video" | "video-edit")
let currentSubTab = "category";

// Global Search/Pagination States
let archiveSearchState = {
  category: {
    status: "전체",
    keyword: ""
  },
  archive: {
    catLarge: "전체",
    catMedium: "전체",
    catSmall: "전체",
    status: "전체",
    searchType: "all",
    keyword: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
    pageIndex: 1
  },
  video: {
    catLarge: "전체",
    catMedium: "전체",
    catSmall: "전체",
    exposure: "전체",
    keyword: "",
    pageSize: 10,
    pageIndex: 1
  }
};

// Currently selected category in the left tree for details viewing
let selectedCategoryId = "cat_large_1";

// New Category creation states
let categoryFormState = {
  mode: "edit", // "edit" | "create"
  level: "large", // "large" | "medium" | "small"
  parentId: null
};

// Active Video Editing State
let activeVideoEditing = null;

// Drag and drop state
let draggedNodeId = null;

// -------------------------------------------------------------
// ROUTING & MENU SWITCHER
// -------------------------------------------------------------
window.switchSubTab = function(tabName) {
  currentSubTab = tabName;
  
  const categoryBtn = document.getElementById('sidebar-archive-category');
  const postsBtn = document.getElementById('sidebar-archive-posts');
  const videoBtn = document.getElementById('sidebar-archive-video');
  const parentBtn = document.getElementById('sidebar-health-archive-btn');

  [categoryBtn, postsBtn, videoBtn].forEach(el => {
    if (el) el.classList.remove('active');
  });

  if (parentBtn) {
    parentBtn.style.color = 'white';
    parentBtn.style.fontWeight = 'bold';
  }

  const titleMap = {
    category: "건강정보 자료실 카테고리 관리",
    archive: "자료실",
    video: "동영상 자료관리",
    "video-edit": "동영상 자료 등록"
  };
  
  const titleText = titleMap[tabName] || "건강정보 자료실";
  document.getElementById('breadcrumb-title').innerText = titleText;

  if (tabName === 'category' && categoryBtn) categoryBtn.classList.add('active');
  if (tabName === 'archive' && postsBtn) postsBtn.classList.add('active');
  if ((tabName === 'video' || tabName === 'video-edit') && videoBtn) videoBtn.classList.add('active');

  const sidebarChildren = document.getElementById('sidebar-archive-children');
  const sidebarArrow = document.getElementById('sidebar-arrow');
  if (sidebarChildren && sidebarChildren.style.display === 'none') {
    sidebarChildren.style.display = 'block';
    if (sidebarArrow) sidebarArrow.style.transform = 'rotate(90deg)';
  }

  renderTabContent();
};

function renderTabContent() {
  const container = document.getElementById('archive-main-workspace');
  if (!container) return;

  if (currentSubTab === 'category') {
    renderCategoryTab(container);
  } else if (currentSubTab === 'archive') {
    renderArchiveTab(container);
  } else if (currentSubTab === 'video') {
    renderVideoTab(container);
  } else if (currentSubTab === 'video-edit') {
    renderVideoEditForm(container);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') || 'category';
  window.switchSubTab(view);
});

window.showToast = function(msg) {
  const tc = document.getElementById('toast-container');
  if (!tc) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-msg">${msg}</div>
  `;
  tc.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.4s ease-out forwards';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
};

// -------------------------------------------------------------
// VIEW 1: CATEGORY MANAGEMENT (Kyobo Mockup High-Fidelity)
// -------------------------------------------------------------
function renderCategoryTab(container) {
  const cats = getArchiveCategories();
  
  // Clean selectedCategoryId check
  if (selectedCategoryId && !cats[selectedCategoryId]) {
    // default select first large category
    const larges = Object.values(cats).filter(c => c.level === 'large').sort((a,b) => a.sortOrder - b.sortOrder);
    selectedCategoryId = larges.length > 0 ? larges[0].id : null;
  }

  const activeCat = selectedCategoryId ? cats[selectedCategoryId] : null;

  // Render breadcrumb path above the right panel
  let pathHtml = '<span style="font-weight:normal;">🏠</span>';
  if (activeCat) {
    if (activeCat.level === 'large') {
      pathHtml += ` <span class="divider">></span> <span class="active-node">${activeCat.label}</span>`;
    } else if (activeCat.level === 'medium') {
      const parentLarge = cats[activeCat.parentId];
      const pName = parentLarge ? parentLarge.label : '';
      pathHtml += ` <span class="divider">></span> <span>${pName}</span> <span class="divider">></span> <span class="active-node">${activeCat.label}</span>`;
    } else if (activeCat.level === 'small') {
      const parentMed = cats[activeCat.parentId];
      const parentLarge = parentMed ? cats[parentMed.parentId] : null;
      const plName = parentLarge ? parentLarge.label : '';
      const pmName = parentMed ? parentMed.label : '';
      pathHtml += ` <span class="divider">></span> <span>${plName}</span> <span class="divider">></span> <span>${pmName}</span> <span class="divider">></span> <span class="active-node">${activeCat.label}</span>`;
    }
  }

  // Setup form values based on state (create or edit)
  const isCreate = categoryFormState.mode === "create";
  let displayType = "대분류";
  let displayParent = "-";
  let initialLabel = "";
  let initialMemo = "";
  let initialStatus = "사용함";

  if (isCreate) {
    displayType = categoryFormState.level === "large" ? "대분류" : (categoryFormState.level === "medium" ? "중분류" : "소분류");
    if (categoryFormState.level === "medium") {
      const parentLarge = cats[categoryFormState.parentId];
      displayParent = parentLarge ? parentLarge.label : "-";
    } else if (categoryFormState.level === "small") {
      const parentMed = cats[categoryFormState.parentId];
      const parentLarge = parentMed ? cats[parentMed.parentId] : null;
      const plName = parentLarge ? parentLarge.label : '';
      const pmName = parentMed ? parentMed.label : '';
      displayParent = `${plName} > ${pmName}`;
    }
  } else if (activeCat) {
    displayType = activeCat.level === "large" ? "대분류" : (activeCat.level === "medium" ? "중분류" : "소분류");
    initialLabel = activeCat.label;
    initialMemo = activeCat.memo || "";
    initialStatus = activeCat.status;

    if (activeCat.level === "medium") {
      const parentLarge = cats[activeCat.parentId];
      displayParent = parentLarge ? parentLarge.label : "-";
    } else if (activeCat.level === "small") {
      const parentMed = cats[activeCat.parentId];
      const parentLarge = parentMed ? cats[parentMed.parentId] : null;
      const plName = parentLarge ? parentLarge.label : '';
      const pmName = parentMed ? parentMed.label : '';
      displayParent = `${plName} > ${pmName}`;
    }
  }

  container.innerHTML = `
    <!-- Top Help Subtitle Section -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div>
        <h2 style="font-size:22px; font-weight:700; color:#0f172a; margin:0 0 4px 0;">건강정보 자료실 카테고리 관리</h2>
        <p style="font-size:13px; color:#64748b; margin:0;">건강정보 자료실에서 사용되는 카테고리를 관리하는 화면입니다.</p>
      </div>
      <button class="btn btn-secondary btn-sm" style="border:1px solid #cbd5e1; font-weight:700;" onclick="alert('카테고리 트리에서 드래그 앤 드롭을 통해 정렬 순서를 변경할 수 있습니다. 자세한 사용법은 도움말을 참고해 주세요.')">❓ 도움말</button>
    </div>

    <!-- MAIN GRID LAYOUT -->
    <div style="display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start;">
      
      <!-- Left Panel: Category Tree -->
      <div class="config-card" style="background:white; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02); min-height: 520px;">
        <div style="padding:16px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="startFormCategoryCreate('large')" style="padding:8px 14px; font-weight:700; background:#2563eb;">+ 대분류 추가</button>
            <button class="btn btn-secondary btn-sm" onclick="renderTabContent()" style="padding:8px; border:1px solid #cbd5e1;" title="새로고침">
              <svg style="width:14px; height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"/></svg>
            </button>
          </div>
        </div>

        <div style="padding: 16px 20px; border-bottom:1px solid #f1f5f9;">
          <div style="font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; display:flex; align-items:center; gap:4px;">
            카테고리 트리 <span style="font-weight:normal; color:#94a3b8; font-size:11px;">ⓘ</span>
          </div>
          <p style="font-size:11px; color:#94a3b8; margin:0 0 10px 0;">카테고리를 선택하면 상세 정보를 확인하고 수정할 수 있습니다.</p>
          
          <div class="cat-alert-banner">
            <span style="font-size: 14px;">⋮⋮</span>
            <span>드래그 앤 드롭으로 카테고리 순서를 변경할 수 있습니다.</span>
          </div>
        </div>

        <!-- Rendered Tree Nodes -->
        <div id="category-tree-nodes-box" style="padding: 16px; max-height: 400px; overflow-y: auto;">
          ${buildCollapsibleCategoryTreeHTML(cats)}
        </div>

        <!-- Left bottom Help panel -->
        <div style="padding:16px 20px;">
          <div class="cat-help-card">
            <div class="cat-help-card-title">도움말</div>
            <ul class="cat-help-card-list">
              <li>대분류를 추가하려면 <strong>'대분류 추가'</strong> 버튼을 클릭하세요.</li>
              <li>하위 분류를 추가하려면 원하는 대분류 또는 중분류를 선택한 후 <strong>'+ 하위분류 추가'</strong> 버튼을 클릭하세요.</li>
              <li>드래그 앤 드롭으로 순서를 변경할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Panel: Category Detail/Registration Form -->
      <div>
        <!-- Breadcrumb display -->
        <div class="right-panel-breadcrumb">
          ${pathHtml}
        </div>

        <div class="config-card" style="background:white; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02); min-height: 480px;">
          <div style="padding:18px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:16px; font-weight:700; color:#0f172a;">카테고리 상세 정보</span>
            <div style="display:flex; gap:8px;">
              <!-- Add child category button (Hidden for small level) -->
              ${(!isCreate && activeCat && activeCat.level !== 'small') ? `
                <button class="btn btn-secondary btn-sm" onclick="startFormCategoryCreate('child')" style="padding:8px 14px; font-weight:700; border:1px solid #cbd5e1; background:white;">
                  + 하위분류 추가
                </button>
              ` : ''}
              <!-- Delete button (Hidden in create mode) -->
              ${!isCreate ? `
                <button class="btn btn-secondary btn-sm" onclick="triggerCategoryDelete()" style="padding:8px 14px; font-weight:700; border:1px solid #fca5a5; color:#ef4444; background:white; display:flex; align-items:center; gap:4px;">
                  🗑 삭제
                </button>
              ` : ''}
            </div>
          </div>

          <div style="padding: 28px 32px;">
            <form id="vform-category-detail-form" onsubmit="handleCategoryFormSubmit(event)" style="display:flex; flex-direction:column; gap:20px; margin:0;">
              
              <!-- Hidden form states -->
              <input type="hidden" id="vcat-id" value="${!isCreate && activeCat ? activeCat.id : ''}">
              <input type="hidden" id="vcat-mode" value="${categoryFormState.mode}">
              <input type="hidden" id="vcat-level" value="${isCreate ? categoryFormState.level : (activeCat ? activeCat.level : 'large')}">
              <input type="hidden" id="vcat-parent-id" value="${isCreate ? categoryFormState.parentId : (activeCat ? activeCat.parentId : '')}">

              <!-- 분류유형 -->
              <div class="form-row-grid">
                <span class="form-label">분류유형</span>
                <div class="vform-readonly-val">${displayType}</div>
              </div>

              <!-- 상위분류 (Hidden for large level) -->
              ${(isCreate && categoryFormState.level !== 'large') || (!isCreate && activeCat && activeCat.level !== 'large') ? `
                <div class="form-row-grid">
                  <span class="form-label">상위분류</span>
                  <div class="vform-readonly-val">${displayParent}</div>
                </div>
              ` : ''}

              <!-- 분류명 -->
              <div class="form-row-grid">
                <span class="form-label form-label-required">분류명</span>
                <div>
                  <div style="position:relative;">
                    <input type="text" id="vcat-label" required placeholder="카테고리명을 입력하세요." maxlength="50" class="form-input" style="padding:10px 60px 10px 12px; font-size:13px;" value="${initialLabel}" oninput="updateCharCounterLocal(this.value, 'vcat-label-counter', 50)">
                    <span id="vcat-label-counter" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:11px; color:#94a3b8;">${initialLabel.length} / 50</span>
                  </div>
                  <span style="font-size:11px; color:#94a3b8; margin-top:4px; display:block;">카테고리명을 입력하세요.</span>
                </div>
              </div>

              <!-- 사용여부 -->
              <div class="form-row-grid">
                <span class="form-label">사용여부</span>
                <div class="inline-radios">
                  <label><input type="radio" name="vcat-status" value="사용함" ${(initialStatus === '사용함') ? 'checked' : ''}> 사용</label>
                  <label><input type="radio" name="vcat-status" value="사용안함" ${(initialStatus === '사용안함') ? 'checked' : ''}> 미사용</label>
                </div>
              </div>

              <!-- 메모 -->
              <div class="form-row-grid align-start">
                <span class="form-label">메모</span>
                <div>
                  <textarea id="vcat-memo" placeholder="메모를 입력하세요. (선택사항)" maxlength="200" class="form-input" style="height:100px; font-size:13px; line-height:1.6;" oninput="updateCharCounterLocal(this.value, 'vcat-memo-counter', 200)">${initialMemo}</textarea>
                  <div class="char-counter" id="vcat-memo-counter">${initialMemo.length} / 200</div>
                </div>
              </div>

              <!-- Bottom Form Buttons -->
              <div style="display:flex; justify-content:center; gap:8px; margin-top:20px; border-top:1px solid #f1f5f9; padding-top:20px;">
                <button type="button" class="btn btn-secondary" onclick="resetFormToEditMode()" style="padding:10px 24px; background:white; border:1px solid #cbd5e1;">취소</button>
                <button type="submit" class="btn btn-primary" style="padding:10px 32px; background:#2563eb;">저장</button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>

    <!-- Alert footer info banner -->
    <div style="background-color: #eff6ff; border:1px solid #bfdbfe; color:#1e4ed8; padding: 12px 20px; border-radius: 8px; margin-top:24px; font-size:13px; font-weight: 600; display:flex; align-items:center; gap:8px;">
      <span>ℹ</span>
      <span>카테고리 순서는 드래그 앤 드롭으로 변경할 수 있습니다.</span>
    </div>
  `;
}

// Collapsible category tree HTML builder with Drag & Drop parameters
function buildCollapsibleCategoryTreeHTML(cats) {
  const catsArray = Object.values(cats);
  const largeCats = catsArray.filter(c => c.level === 'large').sort((a, b) => a.sortOrder - b.sortOrder);
  
  if (largeCats.length === 0) {
    return `<div style="text-align:center; padding:30px; color:#94a3b8; font-size:13px;">등록된 카테고리가 없습니다.</div>`;
  }

  let html = '<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;">';
  
  largeCats.forEach(large => {
    const mediums = catsArray.filter(c => c.level === 'medium' && c.parentId === large.id).sort((a, b) => a.sortOrder - b.sortOrder);
    const hasChildren = mediums.length > 0;
    const isSelectedLarge = selectedCategoryId === large.id && categoryFormState.mode === 'edit';

    html += `
      <li class="cat-node-item" data-id="${large.id}">
        <!-- Large Category Node Wrapper -->
        <div class="cat-node-wrapper cat-node-draggable" 
             draggable="true" 
             ondragstart="window.handleCatDragStart(event, '${large.id}')" 
             ondragend="window.handleCatDragEnd(event)" 
             ondragover="window.handleCatDragOver(event, '${large.id}')" 
             ondragleave="window.handleCatDragLeave(event, '${large.id}')" 
             ondrop="window.handleCatDrop(event, '${large.id}')"
             data-id="${large.id}" 
             style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:6px; background:${isSelectedLarge ? '#eff6ff':'#f8fafc'}; border:1px solid ${isSelectedLarge ? '#2563eb':'#e2e8f0'}; cursor:pointer;" 
             onclick="selectCategoryNode('${large.id}')">
          <span style="font-size:13.5px; font-weight:700; color:${isSelectedLarge ? '#2563eb':'#1e293b'}; display:flex; align-items:center; gap:6px;">
            <span class="drag-handle-btn" title="드래그 정렬">⋮⋮</span>
            📂 ${large.label}
          </span>
          <span class="tree-dot-btn" title="옵션">⋮</span>
        </div>`;
        
    if (hasChildren) {
      html += `<ul style="list-style:none; padding-left:18px; margin:4px 0 0 0; display:flex; flex-direction:column; gap:6px;">`;
      mediums.forEach(med => {
        const smalls = catsArray.filter(c => c.level === 'small' && c.parentId === med.id).sort((a, b) => a.sortOrder - b.sortOrder);
        const hasSmalls = smalls.length > 0;
        const isSelectedMed = selectedCategoryId === med.id && categoryFormState.mode === 'edit';
        
        html += `
          <li class="cat-node-item" data-id="${med.id}">
            <!-- Medium Category Node Wrapper -->
            <div class="cat-node-wrapper cat-node-draggable" 
                 draggable="true" 
                 ondragstart="window.handleCatDragStart(event, '${med.id}')" 
                 ondragend="window.handleCatDragEnd(event)" 
                 ondragover="window.handleCatDragOver(event, '${med.id}')" 
                 ondragleave="window.handleCatDragLeave(event, '${med.id}')" 
                 ondrop="window.handleCatDrop(event, '${med.id}')"
                 data-id="${med.id}" 
                 style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; border-radius:6px; background:${isSelectedMed ? '#eff6ff':'#ffffff'}; border:1px solid ${isSelectedMed ? '#2563eb':'#e2e8f0'}; cursor:pointer;" 
                 onclick="selectCategoryNode('${med.id}')">
              <span style="font-size:13px; font-weight:600; color:${isSelectedMed ? '#2563eb':'#334155'}; display:flex; align-items:center; gap:6px;">
                <span class="drag-handle-btn" title="드래그 정렬">⋮⋮</span>
                ↳ 📂 ${med.label}
              </span>
              <span class="tree-dot-btn" title="옵션">⋮</span>
            </div>`;
            
        if (hasSmalls) {
          html += `<ul style="list-style:none; padding-left:22px; margin:4px 0 0 0; display:flex; flex-direction:column; gap:4px;">`;
          smalls.forEach(sm => {
            const isSelectedSmall = selectedCategoryId === sm.id && categoryFormState.mode === 'edit';
            
            html += `
              <li class="cat-node-item" data-id="${sm.id}">
                <!-- Small Category Node Wrapper -->
                <div class="cat-node-wrapper cat-node-draggable" 
                     draggable="true" 
                     ondragstart="window.handleCatDragStart(event, '${sm.id}')" 
                     ondragend="window.handleCatDragEnd(event)" 
                     ondragover="window.handleCatDragOver(event, '${sm.id}')" 
                     ondragleave="window.handleCatDragLeave(event, '${sm.id}')" 
                     ondrop="window.handleCatDrop(event, '${sm.id}')"
                     data-id="${sm.id}" 
                     style="display:flex; align-items:center; justify-content:space-between; padding:5px 8px; border-radius:6px; background:${isSelectedSmall ? '#eff6ff':'#fcfcfc'}; border:1px solid ${isSelectedSmall ? '#2563eb':'#f1f5f9'}; cursor:pointer;" 
                     onclick="selectCategoryNode('${sm.id}')">
                  <span style="font-size:12px; color:${isSelectedSmall ? '#2563eb':'#475569'}; display:flex; align-items:center; gap:6px;">
                    <span class="drag-handle-btn" title="드래그 정렬">⋮⋮</span>
                    ↳ 📄 ${sm.label}
                  </span>
                </div>
              </li>
            `;
          });
          html += `</ul>`;
        }
        html += `</li>`;
      });
      html += `</ul>`;
    }
    html += `</li>`;
  });
  
  html += '</ul>';
  return html;
}

// -------------------------------------------------------------
// DRAG & DROP BUSINESS LOGIC
// -------------------------------------------------------------
window.handleCatDragStart = function(e, id) {
  draggedNodeId = id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);
  
  const dragEl = document.querySelector(`.cat-node-wrapper[data-id="${id}"]`);
  if (dragEl) {
    setTimeout(() => dragEl.classList.add('dragging'), 0);
  }
};

window.handleCatDragEnd = function(e) {
  const dragEls = document.querySelectorAll('.cat-node-wrapper');
  dragEls.forEach(el => el.classList.remove('dragging', 'cat-drag-over-above', 'cat-drag-over-below'));
  draggedNodeId = null;
};

window.handleCatDragOver = function(e, targetId) {
  if (!draggedNodeId || draggedNodeId === targetId) return;

  const cats = getArchiveCategories();
  const draggedNode = cats[draggedNodeId];
  const targetNode = cats[targetId];

  if (!draggedNode || !targetNode) return;

  // Let the browser allow drops on all nodes, so we can trigger drop event
  // and alert the user if they dropped in a different parent or level.
  e.preventDefault(); 

  const targetEl = document.querySelector(`.cat-node-wrapper[data-id="${targetId}"]`);
  if (targetEl) {
    // Only show valid visual drag feedback if parent and level match
    if (draggedNode.parentId === targetNode.parentId && draggedNode.level === targetNode.level) {
      const rect = targetEl.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      
      if (relativeY < rect.height / 2) {
        targetEl.classList.add('cat-drag-over-above');
        targetEl.classList.remove('cat-drag-over-below');
      } else {
        targetEl.classList.add('cat-drag-over-below');
        targetEl.classList.remove('cat-drag-over-above');
      }
    }
  }
};

window.handleCatDragLeave = function(e, targetId) {
  const targetEl = document.querySelector(`.cat-node-wrapper[data-id="${targetId}"]`);
  if (targetEl) {
    targetEl.classList.remove('cat-drag-over-above', 'cat-drag-over-below');
  }
};

window.handleCatDrop = function(e, targetId) {
  e.preventDefault();
  if (!draggedNodeId || draggedNodeId === targetId) return;

  const cats = getArchiveCategories();
  const draggedNode = cats[draggedNodeId];
  const targetNode = cats[targetId];

  if (!draggedNode || !targetNode) return;

  // Verification: parent and level must match
  if (draggedNode.parentId !== targetNode.parentId || draggedNode.level !== targetNode.level) {
    alert("동일한 상위분류 내에서만 순서를 변경할 수 있습니다.");
    return;
  }

  // Get drop offset position
  const targetEl = document.querySelector(`.cat-node-wrapper[data-id="${targetId}"]`);
  let dropPosition = 'below';
  if (targetEl) {
    if (targetEl.classList.contains('cat-drag-over-above')) {
      dropPosition = 'above';
    }
    targetEl.classList.remove('cat-drag-over-above', 'cat-drag-over-below');
  }

  // Rearrange siblings
  const parentId = draggedNode.parentId;
  const level = draggedNode.level;
  
  let siblings = Object.values(cats)
    .filter(c => c.level === level && c.parentId === parentId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const draggedIndex = siblings.findIndex(s => s.id === draggedNodeId);
  const targetIndex = siblings.findIndex(s => s.id === targetId);

  if (draggedIndex > -1 && targetIndex > -1) {
    const [removed] = siblings.splice(draggedIndex, 1);
    
    let newTargetIndex = siblings.findIndex(s => s.id === targetId);
    if (dropPosition === 'below') {
      newTargetIndex += 1;
    }
    
    siblings.splice(newTargetIndex, 0, removed);

    // Reassign new sortOrders
    siblings.forEach((sib, idx) => {
      cats[sib.id].sortOrder = idx + 1;
    });

    saveArchiveCategories(cats);
    showToast("정렬 순서가 변경되었습니다.");
    
    // Maintain selection on dragged node
    selectedCategoryId = draggedNodeId;
    categoryFormState.mode = "edit";

    renderTabContent();
  }
};

// Selection of Tree Nodes
window.selectCategoryNode = function(id) {
  selectedCategoryId = id;
  categoryFormState.mode = "edit";
  renderTabContent();
};

// Creation Form Switchers
window.startFormCategoryCreate = function(levelType) {
  const cats = getArchiveCategories();
  
  if (levelType === 'large') {
    categoryFormState.mode = "create";
    categoryFormState.level = "large";
    categoryFormState.parentId = null;
  } else if (levelType === 'child') {
    // Current selected acts as parent
    const activeCat = cats[selectedCategoryId];
    if (!activeCat) return;

    if (activeCat.level === 'large') {
      categoryFormState.mode = "create";
      categoryFormState.level = "medium";
      categoryFormState.parentId = activeCat.id;
    } else if (activeCat.level === 'medium') {
      categoryFormState.mode = "create";
      categoryFormState.level = "small";
      categoryFormState.parentId = activeCat.id;
    } else {
      alert("소분류 하위에는 새로운 분류를 추가할 수 없습니다.");
      return;
    }
  }

  renderTabContent();
};

window.resetFormToEditMode = function() {
  categoryFormState.mode = "edit";
  renderTabContent();
};

// Form Save / Submit
window.handleCategoryFormSubmit = function(e) {
  e.preventDefault();
  const mode = document.getElementById('vcat-mode').value;
  const id = document.getElementById('vcat-id').value;
  const label = document.getElementById('vcat-label').value.trim();
  const memo = document.getElementById('vcat-memo').value.trim();
  const status = document.querySelector('input[name="vcat-status"]:checked').value;
  
  const level = document.getElementById('vcat-level').value;
  const parentId = document.getElementById('vcat-parent-id').value;

  if (!label) {
    alert("분류명을 입력하십시오.");
    return;
  }

  const cats = getArchiveCategories();
  const dateStr = getNowFormatted();

  if (mode === 'create') {
    const newId = "cat_" + level + "_" + Date.now();
    
    // Sort order should be max sibling sort + 1
    const siblings = Object.values(cats).filter(c => c.level === level && c.parentId === (parentId || null));
    const maxSort = siblings.length > 0 ? Math.max(...siblings.map(s => s.sortOrder || 0)) : 0;

    cats[newId] = {
      id: newId,
      label: label,
      level: level,
      parentId: parentId || null,
      sortOrder: maxSort + 1,
      status: status,
      memo: memo,
      regDate: dateStr
    };
    
    selectedCategoryId = newId; // select newly created node
  } else {
    if (!cats[id]) return;
    cats[id].label = label;
    cats[id].status = status;
    cats[id].memo = memo;
    cats[id].modDate = dateStr;
    
    selectedCategoryId = id;
  }

  saveArchiveCategories(cats);
  showToast("카테고리가 성공적으로 저장되었습니다.");
  
  categoryFormState.mode = "edit";
  renderTabContent();
};

window.triggerCategoryDelete = function() {
  const id = document.getElementById('vcat-id').value;
  if (!id) return;

  const cats = getArchiveCategories();
  
  // Sibling warning check
  const children = Object.values(cats).filter(c => c.parentId === id);
  if (children.length > 0) {
    alert("해당 카테고리 하위에 연결된 하위 분류가 존재합니다. 삭제하려면 하위 분류들을 먼저 삭제하거나 상위 설정을 변경해 주세요.");
    return;
  }

  if (confirm("이 카테고리를 삭제하시겠습니까?")) {
    const deletedCat = cats[id];
    delete cats[id];
    
    // Re-index remaining sibling sort orders
    if (deletedCat) {
      const siblings = Object.values(cats)
        .filter(c => c.level === deletedCat.level && c.parentId === deletedCat.parentId)
        .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
      siblings.forEach((sib, index) => {
        cats[sib.id].sortOrder = index + 1;
      });
    }

    saveArchiveCategories(cats);
    showToast("카테고리가 삭제되었습니다.");
    
    // Reset selection
    const remainingLarges = Object.values(cats).filter(c => c.level === 'large').sort((a,b) => a.sortOrder - b.sortOrder);
    selectedCategoryId = remainingLarges.length > 0 ? remainingLarges[0].id : null;
    categoryFormState.mode = "edit";

    renderTabContent();
  }
};

// -------------------------------------------------------------
// VIEW 2: ARCHIVE POSTS (자료실)
// -------------------------------------------------------------
function renderArchiveTab(container) {
  const search = archiveSearchState.archive;
  const cats = getArchiveCategories();
  const posts = getArchivePosts();

  let list = [...posts];

  // Apply filters
  if (search.catSmall !== '전체') {
    list = list.filter(p => p.catId === search.catSmall);
  } else if (search.catMedium !== '전체') {
    const smallIds = Object.values(cats).filter(c => c.level === 'small' && c.parentId === search.catMedium).map(c => c.id);
    list = list.filter(p => smallIds.includes(p.catId));
  } else if (search.catLarge !== '전체') {
    const medIds = Object.values(cats).filter(c => c.level === 'medium' && c.parentId === search.catLarge).map(c => c.id);
    const smallIds = Object.values(cats).filter(c => c.level === 'small' && medIds.includes(c.parentId)).map(c => c.id);
    list = list.filter(p => smallIds.includes(p.catId));
  }

  if (search.status !== '전체') {
    list = list.filter(p => p.status === search.status);
  }
  if (search.startDate) {
    const sDate = new Date(search.startDate);
    list = list.filter(p => new Date(p.regDate.split(' ')[0]) >= sDate);
  }
  if (search.endDate) {
    const eDate = new Date(search.endDate);
    list = list.filter(p => new Date(p.regDate.split(' ')[0]) <= eDate);
  }
  if (search.keyword.trim()) {
    const kw = search.keyword.toLowerCase().trim();
    if (search.searchType === 'title') {
      list = list.filter(p => p.title.toLowerCase().includes(kw));
    } else if (search.searchType === 'content') {
      list = list.filter(p => p.content.toLowerCase().includes(kw));
    } else {
      list = list.filter(p => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw));
    }
  }

  // Pagination
  const total = list.length;
  const totalPages = Math.ceil(total / search.pageSize) || 1;
  if (search.pageIndex > totalPages) search.pageIndex = totalPages;
  const startIndex = (search.pageIndex - 1) * search.pageSize;
  const pageItems = list.slice(startIndex, startIndex + search.pageSize);

  // Rows HTML
  let rowsHtml = '';
  if (pageItems.length === 0) {
    rowsHtml = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">등록된 자료실 게시물이 없습니다.</td></tr>`;
  } else {
    rowsHtml = pageItems.map((p, idx) => {
      const smallCat = cats[p.catId];
      const medCat = smallCat ? cats[smallCat.parentId] : null;
      const largeCat = medCat ? cats[medCat.parentId] : null;
      
      const catPath = [
        largeCat ? largeCat.label : '-',
        medCat ? medCat.label : '-',
        smallCat ? smallCat.label : '-'
      ].join(' &gt; ');

      const isExposed = p.status === 'Y';
      const fSizeMB = p.fileSize ? (p.fileSize / (1024 * 1024)).toFixed(2) + " MB" : '-';
      const isWebzine = p.contentType === 'webzine';
      
      return `
        <tr>
          <td style="text-align:center; color:#64748b;">${startIndex + idx + 1}</td>
          <td style="font-size:12px; color:#64748b;" title="${catPath}">${catPath}</td>
          <td>
            <a onclick="window.editPost('${p.id}')" style="font-weight:700; color:#1e293b; text-decoration:none; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              ${p.title}
            </a>
            ${isWebzine ? `<span style="background:#2563eb; color:white; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:6px; display:inline-block; vertical-align:middle;">웹진/카드뉴스</span>` : ''}
          </td>
          <td>
            ${isWebzine ? `
              <div style="display:flex; align-items:center; gap:4px; max-width:260px;">
                <input type="text" readonly id="webzine-url-${p.id}" value="${getWebzineUrl(p.id)}" style="flex-grow:1; font-size:11px; padding:6px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:#f8fafc; color:#475569; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100px;" onclick="this.select()">
                <button class="btn btn-secondary btn-sm" onclick="window.copyWebzineUrl('${p.id}')" style="padding:4px 6px; font-size:11px; white-space:nowrap; font-weight:700;">복사</button>
                <button class="btn btn-primary btn-sm" onclick="window.previewWebzine('${p.id}')" style="padding:4px 6px; font-size:11px; white-space:nowrap; font-weight:700; background:#2563eb; border-color:#2563eb;" title="새 창에서 웹진 재생하기">이동</button>
              </div>
            ` : (p.fileName ? `
              <div style="display:flex; align-items:center; gap:6px; font-size:13px; color:#475569;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                <span title="${p.fileName}" style="max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.fileName}</span>
                <span style="font-size:11px; color:#94a3b8;">(${fSizeMB})</span>
              </div>
            ` : `<span style="color:#94a3b8;">없음</span>`)}
          </td>
          <td style="text-align:center; color:#475569; font-weight:600;">${p.views || 0}</td>
          <td style="text-align:center;">
            <span class="badge-premium ${isExposed ? 'badge-success':'badge-gray'}">${isExposed ? '게시' : '비게시'}</span>
          </td>
          <td style="text-align:center; color:#64748b; font-size:13px;">${p.regDate || '-'}</td>
          <td style="text-align:center;">
            <div style="display:flex; justify-content:center; gap:8px;">
              <button class="btn btn-secondary btn-sm" style="padding:4px 10px; font-size:12px;" onclick="window.editPost('${p.id}')">수정</button>
              <button class="btn btn-danger btn-sm" style="padding:4px 10px; font-size:12px; background:#fee2e2; border-color:#fca5a5; color:#ef4444;" onclick="window.deletePost('${p.id}')">삭제</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Cascading Dropdown Category selections in filter
  const catsArray = Object.values(cats);
  const largeOptions = catsArray.filter(c => c.level === 'large').sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catLarge === c.id ? 'selected':''}>${c.label}</option>`).join('');
  
  let medOptions = '<option value="전체">중분류 전체</option>';
  if (search.catLarge !== '전체') {
    medOptions += catsArray.filter(c => c.level === 'medium' && c.parentId === search.catLarge).sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catMedium === c.id ? 'selected':''}>${c.label}</option>`).join('');
  }
  
  let smallOptions = '<option value="전체">소분류 전체</option>';
  if (search.catMedium !== '전체') {
    smallOptions += catsArray.filter(c => c.level === 'small' && c.parentId === search.catMedium).sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catSmall === c.id ? 'selected':''}>${c.label}</option>`).join('');
  }

  container.innerHTML = `
    <!-- Filter Panel -->
    <div class="search-panel">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">대분류</label>
          <select id="post-filter-cat-large" class="form-input" style="padding:8px 12px; font-size:13px;" onchange="window.handlePostFilterLargeChange(this.value)">
            <option value="전체">대분류 전체</option>
            ${largeOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">중분류</label>
          <select id="post-filter-cat-medium" class="form-input" style="padding:8px 12px; font-size:13px;" onchange="window.handlePostFilterMediumChange(this.value)">
            ${medOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">소분류</label>
          <select id="post-filter-cat-small" class="form-input" style="padding:8px 12px; font-size:13px;">
            ${smallOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">게시 상태</label>
          <select id="post-filter-status" class="form-input" style="padding:8px 12px; font-size:13px;">
            <option value="전체" ${search.status === '전체' ? 'selected':''}>전체</option>
            <option value="Y" ${search.status === 'Y' ? 'selected':''}>게시</option>
            <option value="N" ${search.status === 'N' ? 'selected':''}>비게시</option>
          </select>
        </div>
      </div>
      <div style="display:grid; grid-template-columns: 140px 140px 1fr; gap:12px; margin-bottom:16px; align-items:center;">
        <input type="date" id="post-filter-startdate" class="form-input" style="padding:8px 12px; font-size:13px;" value="${search.startDate}">
        <input type="date" id="post-filter-enddate" class="form-input" style="padding:8px 12px; font-size:13px;" value="${search.endDate}">
        
        <div style="display:flex; gap:6px;">
          <select id="post-filter-searchtype" class="form-input" style="padding:8px 12px; font-size:13px; width: 120px;">
            <option value="all" ${search.searchType === 'all' ? 'selected':''}>제목+내용</option>
            <option value="title" ${search.searchType === 'title' ? 'selected':''}>제목</option>
            <option value="content" ${search.searchType === 'content' ? 'selected':''}>내용</option>
          </select>
          <input type="text" id="post-filter-keyword" class="form-input" placeholder="검색 키워드를 입력하세요." value="${search.keyword}" style="padding:8px 12px; font-size:13px;" onkeyup="if(event.key==='Enter') window.applyPostFilter()">
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-secondary" onclick="window.resetPostFilter()">초기화</button>
        <button class="btn btn-primary" onclick="window.applyPostFilter()">검색</button>
      </div>
    </div>

    <!-- Table Grid -->
    <div class="config-card" style="background:white; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02);">
      <div style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="font-size:14px; font-weight:700; color:#334155;">
          전체 자료글 <span style="color:#2563eb; font-weight:800;">${total}</span>건
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <select id="post-pagesize-select" onchange="window.changePostPageSize(this.value)" class="form-input" style="padding:6px 12px; font-size:12px; width:100px;">
            <option value="5" ${search.pageSize === 5 ? 'selected':''}>5개씩 보기</option>
            <option value="10" ${search.pageSize === 10 ? 'selected':''}>10개씩 보기</option>
            <option value="20" ${search.pageSize === 20 ? 'selected':''}>20개씩 보기</option>
            <option value="50" ${search.pageSize === 50 ? 'selected':''}>50개씩 보기</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="window.openPostModal('create')" style="padding:8px 16px; font-weight:700;">+ 자료글 등록</button>
        </div>
      </div>
      
      <div style="overflow-x:auto;">
        <table class="premium-table">
          <thead>
            <tr>
              <th style="width:50px; text-align:center;">No</th>
              <th style="width:220px;">카테고리 경로</th>
              <th>제목</th>
              <th style="width:200px;">첨부파일</th>
              <th style="width:70px; text-align:center;">조회수</th>
              <th style="width:90px; text-align:center;">게시상태</th>
              <th style="width:150px; text-align:center;">등록일시</th>
              <th style="width:130px; text-align:center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:center; align-items:center; gap:8px;">
        <button onclick="window.setPostPage(1)" ${search.pageIndex === 1 ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">|&lt;</button>
        <button onclick="window.setPostPage(${search.pageIndex - 1})" ${search.pageIndex === 1 ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&lt;</button>
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
          <button onclick="window.setPostPage(${p})" style="border:1px solid ${p === search.pageIndex ? '#2563eb':'#cbd5e1'}; border-radius:4px; padding:4px 10px; background:${p === search.pageIndex ? '#2563eb':'white'}; color:${p === search.pageIndex ? 'white':'#334155'}; font-weight:${p === search.pageIndex ? '700':'500'}; cursor:pointer; font-size:12px;">${p}</button>
        `).join('')}
        <button onclick="window.setPostPage(${search.pageIndex + 1})" ${search.pageIndex === totalPages ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&gt;</button>
        <button onclick="window.setPostPage(${totalPages})" ${search.pageIndex === totalPages ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&gt;|</button>
      </div>
    </div>
  `;
}

window.handlePostFilterLargeChange = function(val) {
  archiveSearchState.archive.catLarge = val;
  archiveSearchState.archive.catMedium = "전체";
  archiveSearchState.archive.catSmall = "전체";
  renderTabContent();
};

window.handlePostFilterMediumChange = function(val) {
  archiveSearchState.archive.catMedium = val;
  archiveSearchState.archive.catSmall = "전체";
  renderTabContent();
};

window.applyPostFilter = function() {
  const search = archiveSearchState.archive;
  search.catSmall = document.getElementById('post-filter-cat-small').value;
  search.status = document.getElementById('post-filter-status').value;
  search.startDate = document.getElementById('post-filter-startdate').value;
  search.endDate = document.getElementById('post-filter-enddate').value;
  search.searchType = document.getElementById('post-filter-searchtype').value;
  search.keyword = document.getElementById('post-filter-keyword').value;
  search.pageIndex = 1;
  renderTabContent();
};

window.resetPostFilter = function() {
  const search = archiveSearchState.archive;
  search.catLarge = "전체";
  search.catMedium = "전체";
  search.catSmall = "전체";
  search.status = "전체";
  search.startDate = "";
  search.endDate = "";
  search.searchType = "all";
  search.keyword = "";
  search.pageIndex = 1;
  renderTabContent();
};

window.changePostPageSize = function(size) {
  archiveSearchState.archive.pageSize = parseInt(size);
  archiveSearchState.archive.pageIndex = 1;
  renderTabContent();
};

window.setPostPage = function(p) {
  archiveSearchState.archive.pageIndex = p;
  renderTabContent();
};

window.updatePostModalCategoryCascading = function() {
  const largeId = document.getElementById('post-modal-cat-large').value;
  const selectMed = document.getElementById('post-modal-cat-medium');
  const cats = getArchiveCategories();
  const activeMeds = Object.values(cats).filter(c => c.level === 'medium' && c.parentId === largeId && c.status === '사용함');
  
  selectMed.innerHTML = activeMeds.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
  updatePostModalCategoryCascadingSmall();
};

window.updatePostModalCategoryCascadingSmall = function() {
  const medId = document.getElementById('post-modal-cat-medium').value;
  const selectSmall = document.getElementById('post-modal-cat-small');
  const cats = getArchiveCategories();
  const activeSmalls = Object.values(cats).filter(c => c.level === 'small' && c.parentId === medId && c.status === '사용함');
  
  selectSmall.innerHTML = activeSmalls.map(s => `<option value="${s.id}">${s.label}</option>`).join('');
};

window.openPostModal = function(mode, postId = null) {
  const modal = document.getElementById('post-modal');
  const modalTitle = document.getElementById('post-modal-title');
  const modalMode = document.getElementById('post-modal-mode');
  const modalId = document.getElementById('post-modal-id');
  const modalStatusSelect = document.getElementById('post-modal-status');
  const modalTitleInput = document.getElementById('post-modal-title-input');
  const modalContent = document.getElementById('post-modal-content');
  
  const modalFileData = document.getElementById('post-modal-file-data');
  const modalFileName = document.getElementById('post-modal-file-name');
  const modalFileSize = document.getElementById('post-modal-file-size');
  
  const fileLbl = document.getElementById('post-modal-file-lbl');
  const fileRemoveBtn = document.getElementById('post-modal-file-remove-btn');

  modalMode.value = mode;

  const cats = getArchiveCategories();
  const activeLarges = Object.values(cats).filter(c => c.level === 'large' && c.status === '사용함');
  if (activeLarges.length === 0) {
    alert("자료글을 등록하려면 사용함 상태의 카테고리를 먼저 설정해 주세요.");
    window.switchSubTab('category');
    return;
  }
  
  document.getElementById('post-modal-cat-large').innerHTML = activeLarges.map(l => `<option value="${l.id}">${l.label}</option>`).join('');
  updatePostModalCategoryCascading();

  if (mode === 'create') {
    modalTitle.innerText = "자료실 글 등록";
    modalId.value = "";
    modalTitleInput.value = "";
    modalContent.value = "";
    modalFileData.value = "";
    modalFileName.value = "";
    modalFileSize.value = "0";
    
    fileLbl.innerText = "선택된 파일 없음";
    fileRemoveBtn.style.display = "none";

    document.getElementById('post-modal-content-type').value = 'general';
    window.togglePostContentTypeFields();
    document.getElementById('webzine-files-list-container').innerHTML = `<div style="text-align:center; padding:12px 0; color:#94a3b8;">구성된 파일이 없습니다. (데모 자동 등록 또는 수동 파일 선택 가능)</div>`;
    document.getElementById('webzine-file-count-lbl').innerText = "0개 파일";
    document.getElementById('post-modal-webzine-slides').value = "";
    document.getElementById('post-modal-webzine-logo').value = "";
  } else {
    modalTitle.innerText = "자료실 글 수정";
    const posts = getArchivePosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    modalId.value = post.id;
    modalStatusSelect.value = post.status;
    modalTitleInput.value = post.title;
    modalContent.value = post.content || '';
    
    modalFileData.value = post.fileData || '';
    modalFileName.value = post.fileName || '';
    modalFileSize.value = post.fileSize || '0';

    if (post.fileName) {
      const mbSize = (post.fileSize / (1024 * 1024)).toFixed(2) + " MB";
      fileLbl.innerText = `${post.fileName} (${mbSize})`;
      fileRemoveBtn.style.display = "inline-block";
    } else {
      fileLbl.innerText = "선택된 파일 없음";
      fileRemoveBtn.style.display = "none";
    }

    const contentType = post.contentType || 'general';
    document.getElementById('post-modal-content-type').value = contentType;
    window.togglePostContentTypeFields();

    if (contentType === 'webzine') {
      const slides = post.slides || [];
      document.getElementById('post-modal-webzine-slides').value = JSON.stringify(slides);
      document.getElementById('post-modal-webzine-logo').value = post.logo || '';
      
      const uiFiles = [
        { name: "index.html", size: "1.6 KB" },
        { name: "style.css", size: "3.1 KB" },
        { name: "script.js", size: "5.2 KB" },
        ...(post.logo ? [{ name: "img/logo.svg", size: "11.0 KB" }] : []),
        ...slides.map((s, idx) => ({
          name: s.startsWith("고지혈증") ? s.replace("고지혈증 1주차/", "") : `img/slide_${idx+1}.jpg`,
          size: s.startsWith("고지혈증") ? "250 KB" : (s.length / 1370).toFixed(0) + " KB"
        }))
      ];
      document.getElementById('webzine-files-list-container').innerHTML = uiFiles.map(uf => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:#2563eb;">📄</span>
            <span>${uf.name}</span>
          </div>
          <span style="font-size:11px; color:#94a3b8;">${uf.size}</span>
        </div>
      `).join('');
      document.getElementById('webzine-file-count-lbl').innerText = uiFiles.length + "개 파일";
    } else {
      document.getElementById('webzine-files-list-container').innerHTML = `<div style="text-align:center; padding:12px 0; color:#94a3b8;">구성된 파일이 없습니다. (데모 자동 등록 또는 수동 파일 선택 가능)</div>`;
      document.getElementById('webzine-file-count-lbl').innerText = "0개 파일";
      document.getElementById('post-modal-webzine-slides').value = "";
      document.getElementById('post-modal-webzine-logo').value = "";
    }

    const smallCat = cats[post.catId];
    if (smallCat) {
      const medCat = cats[smallCat.parentId];
      const largeCat = medCat ? cats[medCat.parentId] : null;

      if (largeCat) {
        document.getElementById('post-modal-cat-large').value = largeCat.id;
        updatePostModalCategoryCascading();
        
        if (medCat) {
          document.getElementById('post-modal-cat-medium').value = medCat.id;
          updatePostModalCategoryCascadingSmall();
          
          document.getElementById('post-modal-cat-small').value = smallCat.id;
        }
      }
    }
  }

  modal.style.display = "flex";
};

window.closePostModal = function() {
  document.getElementById('post-modal').style.display = "none";
};

window.triggerPostFileInput = function() {
  document.getElementById('post-file-input').click();
};

window.handlePostFileSelect = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert("파일 크기는 10MB 이하여야 합니다.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    document.getElementById('post-modal-file-data').value = evt.target.result;
    document.getElementById('post-modal-file-name').value = file.name;
    document.getElementById('post-modal-file-size').value = file.size;

    const fileLbl = document.getElementById('post-modal-file-lbl');
    const fileRemoveBtn = document.getElementById('post-modal-file-remove-btn');
    const mbSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    
    fileLbl.innerText = `${file.name} (${mbSize})`;
    fileRemoveBtn.style.display = "inline-block";
  };
  reader.readAsDataURL(file);
};

window.removePostFile = function() {
  document.getElementById('post-modal-file-data').value = "";
  document.getElementById('post-modal-file-name').value = "";
  document.getElementById('post-modal-file-size').value = "0";

  document.getElementById('post-modal-file-lbl').innerText = "선택된 파일 없음";
  document.getElementById('post-modal-file-remove-btn').style.display = "none";
  document.getElementById('post-file-input').value = "";
};

function getWebzineUrl(id) {
  const href = window.location.href;
  const rootPath = href.substring(0, href.lastIndexOf('/'));
  return `${rootPath}/webzine_viewer.html?id=${id}`;
}

window.copyWebzineUrl = function(id) {
  const urlInput = document.getElementById(`webzine-url-${id}`);
  if (!urlInput) return;
  urlInput.select();
  navigator.clipboard.writeText(urlInput.value).then(() => {
    showToast("웹진 URL이 클립보드에 복사되었습니다.");
  }).catch(err => {
    alert("URL 복사에 실패했습니다. 직접 복사해 주세요.");
  });
};

window.previewWebzine = function(id) {
  const url = getWebzineUrl(id);
  window.open(url, '_blank');
};

window.togglePostContentTypeFields = function() {
  const contentType = document.getElementById('post-modal-content-type').value;
  const contentSec = document.getElementById('post-modal-content-section');
  const fileSec = document.getElementById('post-modal-file-section');
  const webzineSec = document.getElementById('post-modal-webzine-section');
  const contentTxt = document.getElementById('post-modal-content');
  
  if (contentType === 'webzine') {
    contentSec.style.display = 'none';
    fileSec.style.display = 'none';
    webzineSec.style.display = 'flex';
    contentTxt.removeAttribute('required');
  } else {
    contentSec.style.display = 'flex';
    fileSec.style.display = 'flex';
    webzineSec.style.display = 'none';
    contentTxt.setAttribute('required', 'true');
  }
};

window.loadWebzineDemoFiles = function() {
  const files = [
    { name: "index.html", size: "1.6 KB" },
    { name: "style.css", size: "3.1 KB" },
    { name: "script.js", size: "5.2 KB" },
    { name: "img/logo.svg", size: "11.0 KB" },
    { name: "img/1.jpg", size: "245.2 KB" },
    { name: "img/2.jpg", size: "286.3 KB" },
    { name: "img/3.jpg", size: "247.6 KB" },
    { name: "img/4.jpg", size: "270.3 KB" },
    { name: "img/5.jpg", size: "255.1 KB" },
    { name: "img/6.jpg", size: "281.2 KB" },
    { name: "img/7.jpg", size: "272.5 KB" }
  ];
  
  const container = document.getElementById('webzine-files-list-container');
  container.innerHTML = files.map(f => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; border-bottom:1px solid #f1f5f9;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="color:#2563eb;">📄</span>
        <span>${f.name}</span>
      </div>
      <span style="font-size:11px; color:#94a3b8;">${f.size}</span>
    </div>
  `).join('');
  
  document.getElementById('webzine-file-count-lbl').innerText = files.length + "개 파일";
  
  const slides = [
    "고지혈증 1주차/img/1.jpg",
    "고지혈증 1주차/img/2.jpg",
    "고지혈증 1주차/img/3.jpg",
    "고지혈증 1주차/img/4.jpg",
    "고지혈증 1주차/img/5.jpg",
    "고지혈증 1주차/img/6.jpg",
    "고지혈증 1주차/img/7.jpg"
  ];
  document.getElementById('post-modal-webzine-slides').value = JSON.stringify(slides);
  document.getElementById('post-modal-webzine-logo').value = "고지혈증 1주차/img/logo.svg";
  
  showToast("고지혈증 1주차 데모 리소스가 등록되었습니다.");
};

window.triggerWebzineFileInput = function() {
  document.getElementById('webzine-files-input').click();
};

window.handleWebzineFilesSelect = function(e) {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;
  
  const container = document.getElementById('webzine-files-list-container');
  container.innerHTML = `<div style="text-align:center; padding:12px 0; color:#2563eb;">파일 분석 중...</div>`;
  
  const slides = [];
  let loadedCount = 0;
  
  files.forEach(f => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      slides.push(evt.target.result);
      loadedCount++;
      
      if (loadedCount === files.length) {
        document.getElementById('post-modal-webzine-slides').value = JSON.stringify(slides);
        document.getElementById('post-modal-webzine-logo').value = "";
        
        const uiFiles = [
          { name: "index.html (자동 생성)", size: "1.2 KB" },
          { name: "style.css (자동 생성)", size: "2.4 KB" },
          ...files.map(file => ({ name: `img/${file.name}`, size: (file.size / 1024).toFixed(1) + " KB" }))
        ];
        
        container.innerHTML = uiFiles.map(uf => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:#2563eb;">📄</span>
              <span>${uf.name}</span>
            </div>
            <span style="font-size:11px; color:#94a3b8;">${uf.size}</span>
          </div>
        `).join('');
        
        document.getElementById('webzine-file-count-lbl').innerText = uiFiles.length + "개 파일";
        showToast(`${files.length}개의 카드뉴스 슬라이드가 구성되었습니다.`);
      }
    };
    reader.readAsDataURL(f);
  });
};

window.savePost = function(e) {
  e.preventDefault();
  const mode = document.getElementById('post-modal-mode').value;
  const id = document.getElementById('post-modal-id').value;
  const catId = document.getElementById('post-modal-cat-small').value;
  const status = document.getElementById('post-modal-status').value;
  const title = document.getElementById('post-modal-title-input').value.trim();
  const content = document.getElementById('post-modal-content').value.trim();
  
  const fileData = document.getElementById('post-modal-file-data').value;
  const fileName = document.getElementById('post-modal-file-name').value;
  const fileSize = parseInt(document.getElementById('post-modal-file-size').value) || 0;

  const contentType = document.getElementById('post-modal-content-type').value;
  const slidesVal = document.getElementById('post-modal-webzine-slides').value;
  const logoVal = document.getElementById('post-modal-webzine-logo').value;

  if (!catId) {
    alert("소분류 카테고리까지 지정하여 주십시오.");
    return;
  }
  
  if (contentType === 'general') {
    if (!title || !content) {
      alert("제목과 내용을 입력하십시오.");
      return;
    }
  } else {
    if (!title) {
      alert("제목을 입력하십시오.");
      return;
    }
    if (!slidesVal) {
      alert("웹진/카드뉴스에 사용할 이미지 파일들을 업로드하거나 데모 파일을 등록하십시오.");
      return;
    }
  }

  const posts = getArchivePosts();
  const dateStr = getNowFormatted();

  if (mode === 'create') {
    posts.unshift({
      id: "post_" + Date.now(),
      catId: catId,
      title: title,
      content: contentType === 'general' ? content : "",
      contentType: contentType,
      slides: contentType === 'webzine' && slidesVal ? JSON.parse(slidesVal) : [],
      logo: contentType === 'webzine' ? logoVal : null,
      fileName: contentType === 'webzine' ? "고지혈증_1주차_웹진 (HTML/CSS/JS 폴더 구성)" : (fileName || null),
      fileSize: contentType === 'webzine' ? 14850120 : (fileName ? fileSize : 0),
      fileData: contentType === 'webzine' ? null : (fileName ? fileData : null),
      status: status,
      views: 0,
      regDate: dateStr
    });
  } else {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    post.catId = catId;
    post.status = status;
    post.title = title;
    post.contentType = contentType;
    if (contentType === 'general') {
      post.content = content;
      post.fileName = fileName || post.fileName;
      post.fileSize = fileName ? fileSize : post.fileSize;
      post.fileData = fileName ? fileData : post.fileData;
      post.slides = [];
      post.logo = null;
    } else {
      post.content = "";
      post.slides = slidesVal ? JSON.parse(slidesVal) : (post.slides || []);
      post.logo = logoVal || post.logo;
      post.fileName = "고지혈증_1주차_웹진 (HTML/CSS/JS 폴더 구성)";
      post.fileSize = 14850120;
      post.fileData = null;
    }
    post.modDate = dateStr;
  }

  saveArchivePosts(posts);
  closePostModal();
  showToast("자료글이 성공적으로 저장되었습니다.");
  renderTabContent();
};

window.editPost = function(id) {
  window.openPostModal('edit', id);
};

window.deletePost = function(id) {
  if (confirm("이 자료글을 삭제하시겠습니까?")) {
    let posts = getArchivePosts();
    posts = posts.filter(p => p.id !== id);
    saveArchivePosts(posts);
    showToast("자료글이 삭제되었습니다.");
    renderTabContent();
  }
};

// -------------------------------------------------------------
// VIEW 3: VIDEO ARCHIVE (동영상 자료관리)
// -------------------------------------------------------------
function renderVideoTab(container) {
  const search = archiveSearchState.video;
  const cats = getArchiveCategories();
  const videos = getArchiveVideos();

  let list = [...videos];

  // Apply filters
  if (search.catSmall !== '전체') {
    list = list.filter(v => v.catId === search.catSmall);
  } else if (search.catMedium !== '전체') {
    const smallIds = Object.values(cats).filter(c => c.level === 'small' && c.parentId === search.catMedium).map(c => c.id);
    list = list.filter(v => smallIds.includes(v.catId));
  } else if (search.catLarge !== '전체') {
    const medIds = Object.values(cats).filter(c => c.level === 'medium' && c.parentId === search.catLarge).map(c => c.id);
    const smallIds = Object.values(cats).filter(c => c.level === 'small' && medIds.includes(c.parentId)).map(c => c.id);
    list = list.filter(v => smallIds.includes(v.catId));
  }

  if (search.exposure !== '전체') {
    list = list.filter(v => v.exposure === search.exposure);
  }
  if (search.keyword.trim()) {
    const kw = search.keyword.toLowerCase().trim();
    list = list.filter(v => v.title.toLowerCase().includes(kw));
  }

  // Pagination
  const total = list.length;
  const totalPages = Math.ceil(total / search.pageSize) || 1;
  if (search.pageIndex > totalPages) search.pageIndex = totalPages;
  const startIndex = (search.pageIndex - 1) * search.pageSize;
  const pageItems = list.slice(startIndex, startIndex + search.pageSize);

  // Rows HTML
  let rowsHtml = '';
  if (pageItems.length === 0) {
    rowsHtml = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">등록된 동영상이 없습니다.</td></tr>`;
  } else {
    rowsHtml = pageItems.map((v, idx) => {
      const smallCat = cats[v.catId];
      const medCat = smallCat ? cats[smallCat.parentId] : null;
      const largeCat = medCat ? cats[medCat.parentId] : null;
      
      const catPath = [
        largeCat ? largeCat.label : '-',
        medCat ? medCat.label : '-',
        smallCat ? smallCat.label : '-'
      ].join(' &gt; ');

      const isExposed = v.exposure === '노출';
      return `
        <tr>
          <td style="text-align:center; color:#64748b;">${startIndex + idx + 1}</td>
          <td style="font-size:12px; color:#64748b;" title="${catPath}">${catPath}</td>
          <td style="text-align:center;">
            <div class="video-thumbnail-container" style="margin: 0 auto; cursor:pointer;" onclick="window.playVideoPreviewSimulation('${v.id}')" title="동영상 미리보기 재생">
              <img src="${v.thumb}" alt="thumbnail">
            </div>
          </td>
          <td>
            <a onclick="window.editVideo('${v.id}')" style="font-weight:700; color:#1e293b; text-decoration:none; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              ${v.title}
            </a>
            <div style="font-size:11px; color:#94a3b8; margin-top:4px;">파일명: ${v.videoName || '없음'} (${v.duration || '00:00:00'})</div>
          </td>
          <td style="text-align:center; color:#475569; font-weight:600;">${v.views || 0}</td>
          <td style="text-align:center;">
            <span class="badge-premium ${isExposed ? 'badge-success':'badge-gray'}">${isExposed ? '노출' : '미노출'}</span>
          </td>
          <td style="text-align:center; color:#64748b; font-size:13px;">${v.regDate || '-'}</td>
          <td style="text-align:center;">
            <div style="display:flex; justify-content:center; gap:8px;">
              <button class="btn btn-secondary btn-sm" style="padding:4px 10px; font-size:12px;" onclick="window.editVideo('${v.id}')">수정</button>
              <button class="btn btn-danger btn-sm" style="padding:4px 10px; font-size:12px; background:#fee2e2; border-color:#fca5a5; color:#ef4444;" onclick="window.deleteVideo('${v.id}')">삭제</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Cascading Category Options for filters
  const catsArray = Object.values(cats);
  const largeOptions = catsArray.filter(c => c.level === 'large').sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catLarge === c.id ? 'selected':''}>${c.label}</option>`).join('');
  
  let medOptions = '<option value="전체">중분류 전체</option>';
  if (search.catLarge !== '전체') {
    medOptions += catsArray.filter(c => c.level === 'medium' && c.parentId === search.catLarge).sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catMedium === c.id ? 'selected':''}>${c.label}</option>`).join('');
  }
  
  let smallOptions = '<option value="전체">소분류 전체</option>';
  if (search.catMedium !== '전체') {
    smallOptions += catsArray.filter(c => c.level === 'small' && c.parentId === search.catMedium).sort((a,b)=>a.sortOrder-b.sortOrder).map(c => `<option value="${c.id}" ${search.catSmall === c.id ? 'selected':''}>${c.label}</option>`).join('');
  }

  container.innerHTML = `
    <!-- Filter Panel -->
    <div class="search-panel">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">대분류</label>
          <select id="video-filter-cat-large" class="form-input" style="padding:8px 12px; font-size:13px;" onchange="window.handleVideoFilterLargeChange(this.value)">
            <option value="전체">대분류 전체</option>
            ${largeOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">중분류</label>
          <select id="video-filter-cat-medium" class="form-input" style="padding:8px 12px; font-size:13px;" onchange="window.handleVideoFilterMediumChange(this.value)">
            ${medOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">소분류</label>
          <select id="video-filter-cat-small" class="form-input" style="padding:8px 12px; font-size:13px;">
            ${smallOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:700; color:#475569;">노출 여부</label>
          <select id="video-filter-exposure" class="form-input" style="padding:8px 12px; font-size:13px;">
            <option value="전체" ${search.exposure === '전체' ? 'selected':''}>전체</option>
            <option value="노출" ${search.exposure === '노출' ? 'selected':''}>노출</option>
            <option value="미노출" ${search.exposure === '미노출' ? 'selected':''}>미노출</option>
          </select>
        </div>
      </div>
      <div style="display:grid; grid-template-columns: 1fr; gap:12px; margin-bottom:16px; align-items:center;">
        <div style="display:flex; gap:6px;">
          <input type="text" id="video-filter-keyword" class="form-input" placeholder="동영상 제목을 입력하세요." value="${search.keyword}" style="padding:8px 12px; font-size:13px;" onkeyup="if(event.key==='Enter') window.applyVideoFilter()">
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-secondary" onclick="window.resetVideoFilter()">초기화</button>
        <button class="btn btn-primary" onclick="window.applyVideoFilter()">검색</button>
      </div>
    </div>

    <!-- Table Grid -->
    <div class="config-card" style="background:white; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02);">
      <div style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="font-size:14px; font-weight:700; color:#334155;">
          전체 동영상 <span style="color:#2563eb; font-weight:800;">${total}</span>건
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <select id="video-pagesize-select" onchange="window.changeVideoPageSize(this.value)" class="form-input" style="padding:6px 12px; font-size:12px; width:100px;">
            <option value="5" ${search.pageSize === 5 ? 'selected':''}>5개씩 보기</option>
            <option value="10" ${search.pageSize === 10 ? 'selected':''}>10개씩 보기</option>
            <option value="20" ${search.pageSize === 20 ? 'selected':''}>20개씩 보기</option>
            <option value="50" ${search.pageSize === 50 ? 'selected':''}>50개씩 보기</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="window.openVideoCreateForm()" style="padding:8px 16px; font-weight:700;">+ 동영상 등록</button>
        </div>
      </div>
      
      <div style="overflow-x:auto;">
        <table class="premium-table">
          <thead>
            <tr>
              <th style="width:50px; text-align:center;">No</th>
              <th style="width:200px;">카테고리 경로</th>
              <th style="width:110px; text-align:center;">썸네일</th>
              <th>동영상 제목 / 파일 정보</th>
              <th style="width:70px; text-align:center;">조회수</th>
              <th style="width:150px; text-align:center;">노출 여부</th>
              <th style="width:150px; text-align:center;">등록일시</th>
              <th style="width:130px; text-align:center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:center; align-items:center; gap:8px;">
        <button onclick="window.setVideoPage(1)" ${search.pageIndex === 1 ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">|&lt;</button>
        <button onclick="window.setVideoPage(${search.pageIndex - 1})" ${search.pageIndex === 1 ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&lt;</button>
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
          <button onclick="window.setVideoPage(${p})" style="border:1px solid ${p === search.pageIndex ? '#2563eb':'#cbd5e1'}; border-radius:4px; padding:4px 10px; background:${p === search.pageIndex ? '#2563eb':'white'}; color:${p === search.pageIndex ? 'white':'#334155'}; font-weight:${p === search.pageIndex ? '700':'500'}; cursor:pointer; font-size:12px;">${p}</button>
        `).join('')}
        <button onclick="window.setVideoPage(${search.pageIndex + 1})" ${search.pageIndex === totalPages ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&gt;</button>
        <button onclick="window.setVideoPage(${totalPages})" ${search.pageIndex === totalPages ? 'disabled':''} style="border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; background:white; font-size:12px; cursor:pointer;">&gt;|</button>
      </div>
    </div>
  `;
}

window.handleVideoFilterLargeChange = function(val) {
  archiveSearchState.video.catLarge = val;
  archiveSearchState.video.catMedium = "전체";
  archiveSearchState.video.catSmall = "전체";
  renderTabContent();
};

window.handleVideoFilterMediumChange = function(val) {
  archiveSearchState.video.catMedium = val;
  archiveSearchState.video.catSmall = "전체";
  renderTabContent();
};

window.applyVideoFilter = function() {
  const search = archiveSearchState.video;
  search.catSmall = document.getElementById('video-filter-cat-small') ? document.getElementById('video-filter-cat-small').value : '전체';
  search.exposure = document.getElementById('video-filter-exposure').value;
  search.keyword = document.getElementById('video-filter-keyword').value;
  search.pageIndex = 1;
  renderTabContent();
};

window.resetVideoFilter = function() {
  const search = archiveSearchState.video;
  search.catLarge = "전체";
  search.catMedium = "전체";
  search.catSmall = "전체";
  search.exposure = "전체";
  search.keyword = "";
  search.pageIndex = 1;
  renderTabContent();
};

window.changeVideoPageSize = function(size) {
  archiveSearchState.video.pageSize = parseInt(size);
  archiveSearchState.video.pageIndex = 1;
  renderTabContent();
};

window.setVideoPage = function(p) {
  archiveSearchState.video.pageIndex = p;
  renderTabContent();
};

window.deleteVideo = function(id) {
  if (confirm("이 동영상을 삭제하시겠습니까?")) {
    let vids = getArchiveVideos();
    vids = vids.filter(v => v.id !== id);
    saveArchiveVideos(vids);
    showToast("동영상이 삭제되었습니다.");
    renderTabContent();
  }
};

// -------------------------------------------------------------
// VIEW 4: HIGH-FIDELITY VIDEO REGISTRATION/EDIT FORM (Kyobo Mockup)
// -------------------------------------------------------------
window.openVideoCreateForm = function() {
  activeVideoEditing = null;
  window.switchSubTab('video-edit');
};

window.editVideo = function(id) {
  const vids = getArchiveVideos();
  const vid = vids.find(v => v.id === id);
  if (!vid) return;

  activeVideoEditing = vid;
  window.switchSubTab('video-edit');
};

function renderVideoEditForm(container) {
  const isEdit = activeVideoEditing !== null;
  const cats = getArchiveCategories();
  
  const currentDate = isEdit ? activeVideoEditing.regDate.split(' ')[0] : new Date().toISOString().split('T')[0];
  const currentWriter = isEdit ? activeVideoEditing.writer : "신은준 (eunjoon@gyobo.com)";

  const activeLarges = Object.values(cats).filter(c => c.level === 'large' && c.status === '사용함');
  if (activeLarges.length === 0) {
    alert("동영상을 등록하려면 먼저 사용함 상태의 카테고리를 설정하십시오.");
    window.switchSubTab('category');
    return;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div>
        <h2 style="font-size:24px; font-weight:700; color:#0f172a; margin:0 0 6px 0;">
          ${isEdit ? '동영상 자료 수정' : '동영상 자료 등록'}
        </h2>
        <p style="font-size:13px; color:#64748b; margin:0;">고객에게 제공할 동영상 콘텐츠를 등록하고 관리할 수 있습니다.</p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="window.switchSubTab('video')" style="font-weight:700; border: 1px solid #cbd5e1; padding: 8px 16px;">
          📋 목록으로
        </button>
      </div>
    </div>

    <form id="video-detail-high-form" onsubmit="handleVideoFormSubmit(event)" style="margin:0;">
      
      <input type="hidden" id="video-form-thumb-data" value="${isEdit ? activeVideoEditing.thumb : ''}">
      <input type="hidden" id="video-form-video-data" value="${isEdit ? activeVideoEditing.videoData : ''}">
      <input type="hidden" id="video-form-video-name" value="${isEdit ? activeVideoEditing.videoName : ''}">
      <input type="hidden" id="video-form-video-size" value="${isEdit ? activeVideoEditing.videoSize : '0'}">
      <input type="hidden" id="video-form-video-duration" value="${isEdit ? activeVideoEditing.duration : '00:00:00'}">
      
      <input type="hidden" id="video-form-subtitle-name" value="${isEdit ? activeVideoEditing.subtitleName : ''}">
      <input type="hidden" id="video-form-attachment-name" value="${isEdit ? activeVideoEditing.attachmentName : ''}">

      <div class="section-form-card">
        <h3 class="section-form-title">기본 정보</h3>
        
        <div class="form-row-grid">
          <span class="form-label form-label-required">카테고리</span>
          <div class="category-select-group">
            <select id="vform-cat-large" required class="form-input" style="font-size:13px;" onchange="updateVideoFormCategoryCascading()">
              ${activeLarges.map(l => `<option value="${l.id}">${l.label}</option>`).join('')}
            </select>
            <span class="category-select-arrow">&gt;</span>
            <select id="vform-cat-medium" required class="form-input" style="font-size:13px;" onchange="updateVideoFormCategoryCascadingSmall()">
            </select>
            <span class="category-select-arrow">&gt;</span>
            <select id="vform-cat-small" required class="form-input" style="font-size:13px;">
            </select>
          </div>
        </div>

        <div class="form-row-grid">
          <span class="form-label form-label-required">콘텐츠 제목</span>
          <div>
            <input type="text" id="vform-title" required placeholder="동영상 제목을 입력하세요." maxlength="100" class="form-input" style="font-size:13px;" value="${isEdit ? activeVideoEditing.title : ''}" oninput="updateCharCounterLocal(this.value, 'vform-title-counter', 100)">
            <div class="char-counter" id="vform-title-counter">0 / 100</div>
          </div>
        </div>

        <div class="form-row-grid align-start">
          <span class="form-label">콘텐츠 설명</span>
          <div>
            <textarea id="vform-desc" placeholder="동영상에 대한 설명을 입력하세요." maxlength="500" class="form-input" style="height:120px; font-size:13px; line-height:1.6;" oninput="updateCharCounterLocal(this.value, 'vform-desc-counter', 500)">${isEdit ? activeVideoEditing.description : ''}</textarea>
            <div class="char-counter" id="vform-desc-counter">0 / 500</div>
          </div>
        </div>

        <div class="form-row-grid">
          <span class="form-label">키워드</span>
          <input type="text" id="vform-keywords" placeholder="키워드를 입력하세요. (쉼표로 구분)  예) 건강, 운동, 스트레스" class="form-input" style="font-size:13px;" value="${isEdit ? activeVideoEditing.keywords || '' : ''}">
        </div>

        <div class="form-row-grid">
          <span class="form-label">노출 여부</span>
          <div class="inline-radios">
            <label><input type="radio" name="vform-exposure" value="노출" ${(!isEdit || activeVideoEditing.exposure === '노출') ? 'checked':''}> 노출</label>
            <label><input type="radio" name="vform-exposure" value="미노출" ${(isEdit && activeVideoEditing.exposure === '미노출') ? 'checked':''}> 미노출</label>
          </div>
        </div>


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:16px;">
          <div class="form-row-grid">
            <span class="form-label">등록자</span>
            <input type="text" class="form-input default-label-input" style="font-size:13px;" readonly value="${currentWriter}">
          </div>
          <div class="form-row-grid">
            <span class="form-label">등록일</span>
            <input type="date" id="vform-regdate" class="form-input" style="font-size:13px;" value="${currentDate}">
          </div>
        </div>

      </div>

      <div class="section-form-card">
        <h3 class="section-form-title">썸네일 정보</h3>
        
        <div class="form-row-grid align-start">
          <span class="form-label form-label-required">썸네일 이미지</span>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
            <div id="vform-thumb-dragzone" class="upload-drag-zone" style="height:140px;" onclick="triggerFormThumbInput()">
              <div id="vform-thumb-pl" style="display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; padding: 10px;">
                <svg style="width:28px; height:28px; color:#3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/></svg>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:4px 10px; font-weight:700;">파일 선택</button>
                <span style="font-size:11px; color:#64748b; font-weight:500;">또는 파일을 드래그 하세요.<br>JPG, PNG 권장 (최대 5MB)</span>
              </div>
              <img id="vform-thumb-img" style="display:none; width:100%; height:100%; object-fit:cover;" />
              <input type="file" id="vform-thumb-file-input" accept="image/png, image/jpeg" style="display:none;" onchange="handleFormThumbSelect(event)">
            </div>
            
            <div style="background:#f1f5f9; border-radius:8px; border:1px solid #e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; height:140px; overflow:hidden;" id="vform-thumb-preview-box">
              <svg id="vform-thumb-icon-placeholder" style="width:32px; height:32px; color:#94a3b8; margin-bottom:8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"/></svg>
              <span id="vform-thumb-preview-text" style="font-size:12px; color:#64748b;">썸네일 미리보기가 표시됩니다.</span>
              <img id="vform-thumb-preview-real" style="display:none; width:100%; height:100%; object-fit:cover;" />
            </div>
          </div>
        </div>

        <div class="form-row-grid">
          <span class="form-label">대체 텍스트</span>
          <div>
            <input type="text" id="vform-alttext" placeholder="썸네일에 대한 대체 텍스트를 입력하세요." maxlength="100" class="form-input" style="font-size:13px;" value="${isEdit ? activeVideoEditing.altText || '' : ''}" oninput="updateCharCounterLocal(this.value, 'vform-alt-counter', 100)">
            <div class="char-counter" id="vform-alt-counter">0 / 100</div>
          </div>
        </div>

      </div>

      <div class="section-form-card">
        <h3 class="section-form-title">동영상 파일</h3>
        
        <div class="form-row-grid align-start">
          <span class="form-label form-label-required">동영상 파일</span>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
            <div id="vform-video-dragzone" class="upload-drag-zone" style="height:140px;" onclick="triggerFormVideoInput()">
              <div id="vform-video-pl" style="display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; padding: 10px;">
                <svg style="width:28px; height:28px; color:#2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:4px 10px; font-weight:700;">파일 선택</button>
                <span style="font-size:11px; color:#64748b; font-weight:500;" id="vform-video-filename-lbl">또는 파일을 드래그 하세요.<br>MP4 권장 (최대 3GB)</span>
              </div>
              <input type="file" id="vform-video-file-input" accept="video/mp4" style="display:none;" onchange="handleFormVideoSelect(event)">
            </div>
            
            <div class="callout-box">
              <span style="font-weight:700; font-size:13px; display:block; margin-bottom:6px;">권장 사항</span>
              <ul>
                <li>형식: MP4 (H.264, AAC 코덱)</li>
                <li>해상도: 1280x720 (HD) 이상 권장</li>
                <li>화면비율: 16:9 권장</li>
                <li>최대 용량: 3GB 이하</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="form-row-grid">
          <span class="form-label">자막 파일</span>
          <div style="display:flex; gap:12px; align-items:center;">
            <button type="button" onclick="triggerFormSubtitleInput()" class="btn btn-secondary btn-sm" style="padding:8px 14px; font-weight:700; border: 1px solid #cbd5e1;">파일 선택</button>
            <span id="vform-subtitle-lbl" style="font-size:13px; color:#64748b;">
              ${(isEdit && activeVideoEditing.subtitleName) ? activeVideoEditing.subtitleName : '선택 사항 (SRT, VTT 파일)'}
            </span>
            <input type="file" id="vform-subtitle-file-input" accept=".srt,.vtt" style="display:none;" onchange="handleFormSubtitleSelect(event)">
          </div>
        </div>

        <div class="form-row-grid">
          <span class="form-label">첨부 자료</span>
          <div style="display:flex; gap:12px; align-items:center;">
            <button type="button" onclick="triggerFormAttachmentInput()" class="btn btn-secondary btn-sm" style="padding:8px 14px; font-weight:700; border: 1px solid #cbd5e1;">파일 선택</button>
            <span id="vform-attachment-lbl" style="font-size:13px; color:#64748b;">
              ${(isEdit && activeVideoEditing.attachmentName) ? activeVideoEditing.attachmentName : '선택 사항 (PDF, ZIP 등)'}
            </span>
            <input type="file" id="vform-attachment-file-input" accept=".pdf,.zip,.doc,.docx" style="display:none;" onchange="handleFormAttachmentSelect(event)">
          </div>
        </div>

      </div>

      <div class="section-form-card" style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          <h3 class="section-form-title" style="margin-bottom:12px;">재생 설정</h3>
          
          <div class="form-row-grid" style="grid-template-columns: 100px 1fr;">
            <span class="form-label">자동재생</span>
            <div class="inline-radios">
              <label><input type="radio" name="vform-autoplay" value="사용" ${(isEdit && activeVideoEditing.autoplay === '사용') ? 'checked':''}> 사용</label>
              <label><input type="radio" name="vform-autoplay" value="미사용" ${(!isEdit || activeVideoEditing.autoplay === '미사용') ? 'checked':''}> 미사용</label>
            </div>
          </div>

          <div class="form-row-grid" style="grid-template-columns: 100px 1fr;">
            <span class="form-label">반복재생</span>
            <div class="inline-radios">
              <label><input type="radio" name="vform-loop" value="사용" ${(isEdit && activeVideoEditing.loop === '사용') ? 'checked':''}> 사용</label>
              <label><input type="radio" name="vform-loop" value="미사용" ${(!isEdit || activeVideoEditing.loop === '미사용') ? 'checked':''}> 미사용</label>
            </div>
          </div>

          <div class="form-row-grid" style="grid-template-columns: 100px 1fr;">
            <span class="form-label">다운로드 허용</span>
            <div class="inline-radios">
              <label><input type="radio" name="vform-download" value="허용" ${(isEdit && activeVideoEditing.download === '허용') ? 'checked':''}> 허용</label>
              <label><input type="radio" name="vform-download" value="비허용" ${(!isEdit || activeVideoEditing.download === '비허용') ? 'checked':''}> 비허용</label>
            </div>
          </div>

          <div class="form-row-grid" style="grid-template-columns: 100px 1fr;">
            <span class="form-label">진행바 표시</span>
            <div class="inline-radios">
              <label><input type="radio" name="vform-progressbar" value="표시" ${(!isEdit || activeVideoEditing.progressbar === '표시') ? 'checked':''}> 표시</label>
              <label><input type="radio" name="vform-progressbar" value="숨김" ${(isEdit && activeVideoEditing.progressbar === '숨김') ? 'checked':''}> 숨김</label>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px; justify-content: space-between;">
          <div class="callout-box info" style="margin-top: 30px;">
            <span style="font-weight:700; font-size:13px; display:block; margin-bottom:4px;">ℹ 안내</span>
            재생 설정은 동영상 플레이어에 적용됩니다.<br>설정 변경 시 사용자 경험에 영향을 줄 수 있습니다.
          </div>
          
          <div class="expected-playtime-box">
            <span class="playtime-display" id="vform-duration-display">
              ${isEdit ? activeVideoEditing.duration : '00:00:00'}
            </span>
            <span class="playtime-subtext">예상 재생 시간 (동영상 파일 로드 시 자동 확인)</span>
          </div>
        </div>

      </div>

      <div style="display:flex; justify-content:center; gap:12px; margin-top:24px; padding-bottom:40px;">
        <button type="button" class="btn btn-secondary" onclick="window.switchSubTab('video')" style="background:white; border: 1px solid #cbd5e1; padding: 10px 28px;">취소</button>
        <button type="button" class="btn btn-secondary" onclick="window.playFormVideoPreview()" style="background:#e2e8f0; color:#475569; padding: 10px 28px;">미리보기</button>
        <button type="submit" class="btn btn-primary" style="background:#1e3a8a; padding: 10px 32px;">등록</button>
      </div>

    </form>
  `;

  bindFormDragAndDropHandlers();
  presetVideoFormCategorySelects();
}

function bindFormDragAndDropHandlers() {
  const thumbZone = document.getElementById('vform-thumb-dragzone');
  const videoZone = document.getElementById('vform-video-dragzone');

  if (thumbZone) {
    thumbZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      thumbZone.classList.add('dragover');
    });
    thumbZone.addEventListener('dragleave', () => {
      thumbZone.classList.remove('dragover');
    });
    thumbZone.addEventListener('drop', (e) => {
      e.preventDefault();
      thumbZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleThumbnailFile(file);
      } else {
        alert("올바른 이미지 파일(JPG, PNG)을 드롭해 주세요.");
      }
    });
  }

  if (videoZone) {
    videoZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      videoZone.classList.add('dragover');
    });
    videoZone.addEventListener('dragleave', () => {
      videoZone.classList.remove('dragover');
    });
    videoZone.addEventListener('drop', (e) => {
      e.preventDefault();
      videoZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'video/mp4') {
        handleVideoFile(file);
      } else {
        alert("올바른 동영상 파일(MP4)을 드롭해 주세요.");
      }
    });
  }
}

window.updateVideoFormCategoryCascading = function() {
  const largeId = document.getElementById('vform-cat-large').value;
  const selectMed = document.getElementById('vform-cat-medium');
  const cats = getArchiveCategories();
  const activeMeds = Object.values(cats).filter(c => c.level === 'medium' && c.parentId === largeId && c.status === '사용함');
  
  selectMed.innerHTML = activeMeds.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
  updateVideoFormCategoryCascadingSmall();
};

window.updateVideoFormCategoryCascadingSmall = function() {
  const medId = document.getElementById('vform-cat-medium').value;
  const selectSmall = document.getElementById('vform-cat-small');
  const cats = getArchiveCategories();
  const activeSmalls = Object.values(cats).filter(c => c.level === 'small' && c.parentId === medId && c.status === '사용함');
  
  selectSmall.innerHTML = activeSmalls.map(s => `<option value="${s.id}">${s.label}</option>`).join('');
};

function presetVideoFormCategorySelects() {
  const isEdit = activeVideoEditing !== null;
  const cats = getArchiveCategories();

  if (isEdit) {
    const smallCat = cats[activeVideoEditing.catId];
    if (smallCat) {
      const medCat = cats[smallCat.parentId];
      const largeCat = medCat ? cats[medCat.parentId] : null;

      if (largeCat) {
        document.getElementById('vform-cat-large').value = largeCat.id;
        window.updateVideoFormCategoryCascading();
        
        if (medCat) {
          document.getElementById('vform-cat-medium').value = medCat.id;
          window.updateVideoFormCategoryCascadingSmall();
          
          document.getElementById('vform-cat-small').value = smallCat.id;
        }
      }
    }
  } else {
    window.updateVideoFormCategoryCascading();
  }
}

window.triggerFormThumbInput = function() {
  document.getElementById('vform-thumb-file-input').click();
};

window.handleFormThumbSelect = function(e) {
  const file = e.target.files[0];
  if (file) handleThumbnailFile(file);
};

function handleThumbnailFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    alert("썸네일 이미지 크기는 5MB 이하여야 합니다.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(evt) {
    document.getElementById('video-form-thumb-data').value = evt.target.result;
    
    const dragImg = document.getElementById('vform-thumb-img');
    const dragPl = document.getElementById('vform-thumb-pl');
    dragImg.src = evt.target.result;
    dragImg.style.display = 'block';
    dragPl.style.display = 'none';

    const prevText = document.getElementById('vform-thumb-preview-text');
    const prevIcon = document.getElementById('vform-thumb-icon-placeholder');
    const prevReal = document.getElementById('vform-thumb-preview-real');
    
    prevReal.src = evt.target.result;
    prevReal.style.display = 'block';
    prevText.style.display = 'none';
    prevIcon.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

window.triggerFormVideoInput = function() {
  document.getElementById('vform-video-file-input').click();
};

window.handleFormVideoSelect = function(e) {
  const file = e.target.files[0];
  if (file) handleVideoFile(file);
};

function handleVideoFile(file) {
  if (file.size > 3 * 1024 * 1024 * 1024) {
    alert("동영상 파일 크기는 3GB 이하여야 합니다.");
    return;
  }

  const blobUrl = URL.createObjectURL(file);
  document.getElementById('video-form-video-data').value = blobUrl;
  document.getElementById('video-form-video-name').value = file.name;
  document.getElementById('video-form-video-size').value = file.size;

  const dragLbl = document.getElementById('vform-video-filename-lbl');
  const mbSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
  dragLbl.innerHTML = `<strong>${file.name}</strong> (${mbSize})<br><span style="color:#17b890;">파일이 성공적으로 로드되었습니다!</span>`;

  const tempVideo = document.createElement('video');
  tempVideo.preload = 'metadata';
  tempVideo.src = blobUrl;
  tempVideo.onloadedmetadata = function() {
    const durSecs = Math.floor(tempVideo.duration) || 184;
    const formatted = formatDurationString(durSecs);
    document.getElementById('video-form-video-duration').value = formatted;
    document.getElementById('vform-duration-display').innerText = formatted;
  };
  tempVideo.onerror = function() {
    const randomSecs = 180 + Math.floor(Math.random() * 300);
    const formatted = formatDurationString(randomSecs);
    document.getElementById('video-form-video-duration').value = formatted;
    document.getElementById('vform-duration-display').innerText = formatted;
  };
}

function formatDurationString(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

window.triggerFormSubtitleInput = function() {
  document.getElementById('vform-subtitle-file-input').click();
};

window.handleFormSubtitleSelect = function(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('video-form-subtitle-name').value = file.name;
    document.getElementById('vform-subtitle-lbl').innerHTML = `<strong style="color:#2563eb;">${file.name}</strong>`;
  }
};

window.triggerFormAttachmentInput = function() {
  document.getElementById('vform-attachment-file-input').click();
};

window.handleFormAttachmentSelect = function(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('video-form-attachment-name').value = file.name;
    document.getElementById('vform-attachment-lbl').innerHTML = `<strong style="color:#2563eb;">${file.name}</strong>`;
  }
};

window.playFormVideoPreview = function() {
  const videoUrl = document.getElementById('video-form-video-data').value;
  const title = document.getElementById('vform-title').value.trim() || "미등록 동영상 제목";

  if (!videoUrl) {
    alert("먼저 동영상 파일을 선택하거나 업로드해 주십시오.");
    return;
  }

  openVideoPreviewModal(videoUrl, title);
};

window.playVideoPreviewSimulation = function(id) {
  const vids = getArchiveVideos();
  const vid = vids.find(v => v.id === id);
  if (!vid) return;

  const playUrl = (vid.videoData === 'mock_blob_url') ? 
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : 
    vid.videoData;

  openVideoPreviewModal(playUrl, vid.title);
};

function openVideoPreviewModal(url, title) {
  const modal = document.getElementById('video-preview-modal');
  const player = document.getElementById('video-preview-player');
  const titleText = document.getElementById('video-preview-modal-sub');

  if (!modal || !player) return;

  titleText.innerText = title;
  player.src = url;
  
  modal.style.display = 'flex';
  player.play().catch(e => console.log("Auto play prevented:", e));
}

window.closeVideoPreviewModal = function() {
  const modal = document.getElementById('video-preview-modal');
  const player = document.getElementById('video-preview-player');
  if (modal) modal.style.display = 'none';
  if (player) {
    player.pause();
    player.src = "";
  }
};
window.handleVideoFormSubmit = function(e) {
  if (e) e.preventDefault();

  const title = document.getElementById('vform-title').value.trim();
  const desc = document.getElementById('vform-desc').value.trim();
  const keywords = document.getElementById('vform-keywords').value.trim();
  
  const exposureRadios = document.getElementsByName('vform-exposure');
  let exposure = '노출';
  exposureRadios.forEach(r => {
    if (r.checked) exposure = r.value;
  });

  const status = '게시';

  const catId = document.getElementById('vform-cat-small').value;
  if (!catId) {
    alert("카테고리의 소분류까지 올바르게 지정하십시오.");
    return;
  }

  if (!title) {
    alert("콘텐츠 제목을 입력하십시오.");
    return;
  }

  const thumb = document.getElementById('video-form-thumb-data').value;
  if (!thumb) {
    alert("동영상 썸네일 이미지를 업로드하십시오.");
    return;
  }

  const videoName = document.getElementById('video-form-video-name').value;
  if (!videoName) {
    alert("동영상 파일을 올려주십시오.");
    return;
  }

  const videoData = document.getElementById('video-form-video-data').value;
  const videoSize = parseInt(document.getElementById('video-form-video-size').value) || 0;
  const duration = document.getElementById('video-form-video-duration').value || '00:03:00';
  
  const subtitleName = document.getElementById('video-form-subtitle-name').value;
  const attachmentName = document.getElementById('video-form-attachment-name').value;

  const autoplayRadios = document.getElementsByName('vform-autoplay');
  let autoplay = '미사용';
  autoplayRadios.forEach(r => { if (r.checked) autoplay = r.value; });

  const loopRadios = document.getElementsByName('vform-loop');
  let loop = '미사용';
  loopRadios.forEach(r => { if (r.checked) loop = r.value; });

  const downloadRadios = document.getElementsByName('vform-download');
  let download = '비허용';
  downloadRadios.forEach(r => { if (r.checked) download = r.value; });

  const progressbarRadios = document.getElementsByName('vform-progressbar');
  let progressbar = '표시';
  progressbarRadios.forEach(r => { if (r.checked) progressbar = r.value; });

  const vids = getArchiveVideos();
  const dateStr = getNowFormatted();

  const isEdit = activeVideoEditing !== null;

  if (isEdit) {
    const vid = vids.find(v => v.id === activeVideoEditing.id);
    if (vid) {
      vid.catId = catId;
      vid.title = title;
      vid.description = desc;
      vid.keywords = keywords;
      vid.exposure = exposure;
      vid.status = status;
      vid.thumb = thumb;
      vid.altText = document.getElementById('vform-alttext').value.trim();
      vid.videoName = videoName;
      vid.videoSize = videoSize;
      vid.videoData = videoData;
      vid.duration = duration;
      vid.subtitleName = subtitleName;
      vid.attachmentName = attachmentName;
      vid.autoplay = autoplay;
      vid.loop = loop;
      vid.download = download;
      vid.progressbar = progressbar;
      vid.modDate = dateStr;
    }
  } else {
    vids.unshift({
      id: "vid_" + Date.now(),
      catId: catId,
      title: title,
      description: desc,
      keywords: keywords,
      exposure: exposure,
      status: status,
      writer: "신은준 (eunjoon@gyobo.com)",
      regDate: dateStr,
      thumb: thumb,
      altText: document.getElementById('vform-alttext').value.trim(),
      videoName: videoName,
      videoSize: videoSize,
      videoData: videoData,
      duration: duration,
      subtitleName: subtitleName,
      attachmentName: attachmentName,
      autoplay: autoplay,
      loop: loop,
      download: download,
      progressbar: progressbar,
      views: 0
    });
  }

  saveArchiveVideos(vids);
  showToast(status === '임시저장' ? "임시저장되었습니다." : "동영상이 등록되었습니다.");
  window.switchSubTab('video');
};

// -------------------------------------------------------------
// SHARED UTILITIES
// -------------------------------------------------------------
function getNowFormatted() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
