import { createClient } from "@supabase/supabase-js";

/* ==========================================================================
   1. UTILS & CONSTANTS
   ========================================================================== */

// -- Asset Resolution --
const resolveAsset = (path) => {
  const base = (import.meta.env && import.meta.env.BASE_URL) || "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

// -- Deep Clone --
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// -- COLORS --
const PENLIGHT_COLORS = [
  { name: "RED", code: "#FF0000" },
  { name: "BLUE", code: "#0047FF" },
  { name: "WHITE", code: "#FFFFFF" },
  { name: "ORANGE", code: "#FFA500" },
  { name: "GREEN", code: "#00C853" },
  { name: "PURPLE", code: "#8000FF" },
  { name: "PINK", code: "#FF69B4" },
  { name: "YELLOW", code: "#FFEA00" },
  { name: "LIGHT GREEN", code: "#90EE90" },
  { name: "LIGHT BLUE", code: "#87CEFA" },
  { name: "LIGHT PINK", code: "#FFB6C1" },
  { name: "VIOLET", code: "#EE82EE" },
  { name: "LIME", code: "#32CD32" },
  { name: "TURQUOISE", code: "#40E0D0" },
  { name: "HOT PINK", code: "#FF1493" },
];

// -- LEVELS --
const LEVEL_TABLE = [
  { key: "lv1", max: 150, name: "初歩オタ", levelClass: "level-1", names: { ja: "初歩オタ", en: "Rookie Ota", ko: "초보 오타" } },
  { key: "lv2", max: 200, name: "ぽんこつオタ", levelClass: "level-1", names: { ja: "ぽんこつオタ", en: "Clumsy Ota", ko: "폰코츠 오타" } },
  { key: "lv3", max: 250, name: "見習いオタ", levelClass: "level-1", names: { ja: "見習いオタ", en: "Apprentice Ota", ko: "견습 오타" } },
  { key: "lv4", max: 300, name: "修行オタ", levelClass: "level-1", names: { ja: "修行オタ", en: "Training Ota", ko: "수련 오타" } },
  { key: "lv5", max: 330, name: "最前オタ", levelClass: "level-2", names: { ja: "最前オタ", en: "Front-Row Ota", ko: "최전열 오타" } },
  { key: "lv6", max: 360, name: "常連オタ", levelClass: "level-2", names: { ja: "常連オタ", en: "Regular Ota", ko: "단골 오타" } },
  { key: "lv7", max: 400, name: "フロアの要オタ", levelClass: "level-2", names: { ja: "フロアの要オタ", en: "Floor Anchor Ota", ko: "플로어의 핵심 오타" } },
  { key: "lv8", max: 420, name: "ベテランオタ", levelClass: "level-2", names: { ja: "ベテランオタ", en: "Veteran Ota", ko: "베테랑 오타" } },
  { key: "lv9", max: 450, name: "熟練オタ", levelClass: "level-2", names: { ja: "熟練オタ", en: "Skilled Ota", ko: "숙련 오타" } },
  { key: "lv10", max: 470, name: "尊いオタ", levelClass: "level-2", names: { ja: "尊いオタ", en: "Blessed Ota", ko: "귀한 오타" } },
  { key: "lv11", max: 490, name: "爆レスオタ", levelClass: "level-2", names: { ja: "爆レスオタ", en: "Burst Ota", ko: "폭레스 오타" } },
  { key: "lv12", max: 500, name: "伝説のオタ", levelClass: "level-2", names: { ja: "伝説のオタ", en: "Legendary Ota", ko: "전설의 오타" } },
  { key: "lv13", max: 530, name: "異次元オタ", levelClass: "level-3", names: { ja: "異次元オタ", en: "Otherworld Ota", ko: "이차원 오타" } },
  { key: "lv14", max: 560, name: "限界突破オタ", levelClass: "level-3", names: { ja: "限界突破オタ", en: "Limit Break Ota", ko: "한계돌파 오타" } },
  { key: "lv15", max: 599, name: "天界オタ", levelClass: "level-3", names: { ja: "天界オタ", en: "Celestial Ota", ko: "천계 오타" } },
  { key: "lv16", max: Infinity, name: "オタクの神", levelClass: "level-3", names: { ja: "オタクの神", en: "God of Ota", ko: "오타쿠의 신" } },
];

// -- SCORES --
const MODE_SCORE = {
  easy: 6,
  normal: 10,
  hard: 13,
};

// -- IMAGES --
const appealImageSources = [
  resolveAsset("images/reactionaa.jpg"),
  resolveAsset("images/reactionbb.jpg"),
  resolveAsset("images/reactioncc.jpg"),
  resolveAsset("images/reactiondd.jpg"),
];

/* ==========================================================================
   2. I18N
   ========================================================================== */

const TRANSLATIONS = {
  ja: {
    "hero.title": "推しライト LIVE!!",
    "hero.subtitle": "ペンライトを合わせて推しのレスをつかめ!🔥",
    "top.start": "ゲームスタート",
    "top.howto": "操作説明",
    "top.ranking": "ランキングを見る",
    "ranking.title": "🏆 ランキング",
    "ranking.description": "ニックネームを入力してランキングに投稿しよう！",
    "ranking.submitTitle": "スコアを投稿",
    "ranking.form.usernameLabel": "ニックネーム",
    "ranking.form.handleLabel": "Xアカウント",
    "ranking.form.handleOptional": "(任意)",
    "ranking.form.handleHint": "XのIDを入れると、フレンドがあなたのXアカウントを確認できます！",
    "ranking.form.submit": "ランキングに投稿",
    "ranking.form.success": "投稿しました！ありがとう！",
    "ranking.form.error": "投稿に失敗しました。時間を空けて再度お試しください。",
    "ranking.submit.inProgress": "送信中...",
    "ranking.form.validationHandle": "XアカウントIDは英数字とアンダースコアのみ利用できます。",
    "ranking.form.validationMissingScore": "最新のスコアがありません。ゲームをプレイして結果を投稿しよう！",
    "ranking.noScore": "ユーザー名とXのIDを入力してランキングに参加しよう！",
    "ranking.ready": "投稿準備OK！",
    "ranking.currentScoreLabel": "今回のスコア",
    "ranking.currentLevelLabel": "オタレベル",
    "ranking.list.title": "トップスコア",
    "ranking.list.empty": "まだ投稿がありません",
    "ranking.list.position": "{rank}位",
    "ranking.list.more": "500位以内のみ表示しています。",
    "ranking.anonymous": "匿名",
    "ranking.loading": "読み込み中...",
    "ranking.disabled": "ランキング機能は現在利用できません（環境変数を設定してください）。",
    "ranking.notice": "同スコアの場合は先に投稿した人が上位に表示されます。",
    "ranking.personal.title": "あなたの順位",
    "ranking.personal.unavailable": "まだ投稿がありません。",
    "ranking.personal.outside": "トップ500圏外 ({rank}位)",
    "ranking.personal.latestScore": "最新スコア",
    "ranking.personal.latestLevel": "オタレベル",
    "ranking.personal.deleteLatest": "最新の投稿を削除",
    "ranking.personal.deleteConfirm": "最新の投稿を削除しますか？",
    "ranking.personal.deleteSuccess": "投稿を削除しました",
    "ranking.personal.deleteError": "投稿の削除に失敗しました",
    "ranking.personal.allEntries": "あなたの履歴",
    "ranking.personal.deleteEntryConfirm": "この投稿を削除しますか？",
    "settings.title": "難易度・設定",
    "mode.easy.title": "🔰EASY",
    "mode.easy.desc": "+6点／色見本付き練習モード！",
    "mode.normal.title": "⚡NORMAL",
    "mode.normal.desc": "+10点／色順を覚えてガチ勝負！",
    "mode.hard.title": "🔥HARD",
    "mode.hard.desc": "+13点／ボタンの故障を乗り越え高得点を狙え！",
    "howto.title": "🎮 操作ガイド",
    "howto.step1": "スタート後、中央の「お題カラー」をチェック。",
    "howto.step2": "左右のボタンで順番にペンライトを回して一致させます。",
    "howto.step3": "2 秒以内に 3 回連続成功でフィーバー突入！",
    "howto.step4": "フィーバー中はスワイプ（左右往復）でポイントとレス演出を稼ごう。",
    "howto.imageNote": "操作説明画像は後日差し替え予定",
    "hud.scoreLabel": "スコア",
    "hud.successLabel": "成功回数",
    "hud.timeLabel": "残り時間",
    "target.title": "TARGET COLOR",
    "controls.turnLeft": "逆回し",
    "controls.turnRight": "順回し",
    "play.showResult": "終了する",
    "play.pause": "中断する",
    "play.resume": "再開する",
    "play.retry": "もう一度プレイ",
    "play.toTop": "トップに戻る",
    "fever.title": "アピールタイム！",
    "fever.message": "ペンライトをたくさん振って爆レスをもらおう！",
    "fever.swipe": "左右にスワイプ！",
    "fever.timerUnit": "秒",
    "fever.countUnit": "往復",
    "fever.stage": "認知 Lv.{level}",
    "result.title": "ライブ結果",
    "result.scoreLabel": "トータルスコア",
    "result.levelLabel": "オタレベル",
    "result.successLabel": "成功回数",
    "result.responsesLabel": "レス獲得数",
    "share.button": "Xでシェア",
    "share.note": "スクショを添えて、あなたの輝きを見せよう!✨",
    "history.title": "最近のスコア",
    "history.empty": "初プレイを記録しよう！",
    "history.pointsUnit": "点",
    "toast.glitch": "ボタンが故障！連打で復旧しよう…",
    "toast.match": "ナイス！ +{points} 点",
    "toast.feverStart": "アピールタイム突入！",
    "toast.feverLevelUp": "認知レベルアップ！",
    "toast.feverEnd": "アピールタイム終了！",
    "share.template":
      "オタクレベル「{levelName}」！トータルスコア{score}！\n{responses}回 推しにレスもらったよ😭💕 #推しライトLIVE #ライブアイドル",
    "penlight.off": "OFF",
    "transition.resultTitle": "結果発表✨",
    "transition.resultSubtitle": "あなたのオタクレベルは？？",
    "howto.section.basics.title": "⭐ 基本操作",
    "howto.section.basics.item1": "・スタート後に「TARGET COLOR」を確認。",
    "howto.section.basics.item2": "・左右ボタンでペンライトの色を切り替え、「TARGET COLOR」と一致させると得点が入ります。",
    "howto.section.basics.item3": "・2秒以内に3回成功すると「アピールタイム」に突入します。",
    "howto.section.fever.title": "⭐ アピールタイム",
    "howto.section.fever.item1": "・左右スワイプでペンライトを振ると10 回ごとに +10pt を獲得、さらに推しのレス演出もレベルアップします。",
    "howto.section.fever.item2": "・アピールタイムは 10 秒間続き、その間メインタイマーは停止します。",
    "howto.section.fever.item3": "・終了後は自動で通常モードに戻ります。",
    "howto.section.scoring.title": "⭐ 通常モードの得点（1回成功ごと）",
    "howto.section.scoring.item1": "・EASY：+6pt",
    "howto.section.scoring.item2": "・NORMAL：+10pt",
    "howto.section.scoring.item3": "・HARD：+13pt",
    "howto.section.feverScoring.title": "アピールタイム中の得点",
    "howto.section.feverScoring.item1": "左右スワイプ 10 回ごとに +10pt を獲得。",
    "howto.section.feverScoring.item2": "同時にレス獲得数も増え、演出がさらに華やかになります。",
    "ranking.form.usernamePlaceholder": "例：ペンライト太郎",
    "ranking.form.handlePlaceholder": "例：oshi_light（@は自動で付きます）",
  },
  en: {
    "hero.title": "OshiLight LIVE!!",
    "hero.subtitle": "Sync Your Light stick and Catch Your Oshi’s Reaction!🔥",
    "top.start": "Start Game",
    "top.howto": "How to Play",
    "top.ranking": "View Ranking",
    "ranking.title": "🏆 Leaderboard",
    "ranking.description": "Enter your nickname and submit your score!",
    "ranking.submitTitle": "Submit Score",
    "ranking.form.usernameLabel": "Nickname",
    "ranking.form.handleLabel": "X Account",
    "ranking.form.handleOptional": "(Optional)",
    "ranking.form.handleHint": "Entering your X ID lets others visit your profile!",
    "ranking.form.submit": "Send to Leaderboard",
    "ranking.form.success": "Thanks! Your score is now on the board!",
    "ranking.form.error": "Submission failed. Please try again shortly.",
    "ranking.submit.inProgress": "Submitting...",
    "ranking.form.validationHandle": "Only letters, numbers, and underscores are allowed in @ID.",
    "ranking.form.validationMissingScore": "No recent score found. Play a round and submit afterwards.",
    "ranking.noScore": "No recent score found. Play a round and submit your result!",
    "ranking.ready": "Enter your name and @ID to join the leaderboard!",
    "ranking.currentScoreLabel": "Current Score",
    "ranking.currentLevelLabel": "Ota Level",
    "ranking.list.title": "Top 500",
    "ranking.list.empty": "No entries yet.",
    "ranking.list.position": "Rank {rank}",
    "ranking.list.more": "Only the Top 500 entries are shown.",
    "ranking.anonymous": "Anonymous fan",
    "ranking.loading": "Loading...",
    "ranking.disabled": "Leaderboard is unavailable. Please set the environment keys.",
    "ranking.notice": "Ties are broken by the earlier submission time.",
    "ranking.personal.title": "Your Placement",
    "ranking.personal.unavailable": "You haven't submitted a score yet.",
    "ranking.personal.outside": "You are outside the Top 500, but your rank is {rank}.",
    "ranking.personal.latestScore": "Latest Score",
    "ranking.personal.latestLevel": "Ota Level",
    "ranking.personal.deleteLatest": "Delete Latest Submission",
    "ranking.personal.deleteConfirm": "Delete your latest submission? This action cannot be undone.",
    "ranking.personal.deleteSuccess": "Submission deleted.",
    "ranking.personal.deleteError": "Failed to delete. Please try again later.",
    "ranking.personal.allEntries": "Your History",
    "ranking.personal.deleteEntryConfirm": "Delete this submission? This action cannot be undone.",
    "settings.title": "Difficulty & Settings",
    "mode.easy.title": "🔰EASY",
    "mode.easy.desc": "+6 pts / Practice with color hints!",
    "mode.normal.title": "⚡NORMAL",
    "mode.normal.desc": "+10 pts / Remember the colors and challenge yourself!",
    "mode.hard.title": "🔥HARD",
    "mode.hard.desc": "+13 pts / Beat the glitches and hit the high score!",
    "howto.title": "🎮 Gameplay Guide",
    "howto.step1": "After starting, check the target color at the top.",
    "howto.step2": "Spin the penlight left/right to match the target color.",
    "howto.step3": "Match 3 times within 2 seconds to trigger Fever Time!",
    "howto.step4": "During Fever, swipe left and right to pile up points and responses.",
    "howto.imageNote": "A detailed how-to image will be added soon.",
    "hud.scoreLabel": "Score",
    "hud.successLabel": "Matches",
    "hud.timeLabel": "Time Left",
    "target.title": "TARGET COLOR",
    "controls.turnLeft": "Spin Left",
    "controls.turnRight": "Spin Right",
    "play.showResult": "Exit",
    "play.pause": "Pause",
    "play.resume": "Resume",
    "play.retry": "Play Again",
    "play.toTop": "Back to Top",
    "fever.title": "Appeal Time!",
    "fever.message": "Swing your Light Stick like crazy and earn mega reactions!",
    "fever.swipe": "Swipe left and right!",
    "fever.timerUnit": "sec",
    "fever.countUnit": "swings",
    "fever.stage": "RECOGNITION Lv.{level}",
    "result.title": "Live Results",
    "result.scoreLabel": "Total Score",
    "result.levelLabel": "Ota Level",
    "result.successLabel": "Matches",
    "result.responsesLabel": "Responses",
    "share.button": "Share on X",
    "share.note": "Add a screenshot to make it shine brighter!✨",
    "history.title": "Recent Scores",
    "history.empty": "Play once to record your first score!",
    "history.pointsUnit": "pts",
    "toast.glitch": "Button malfunction! Tap rapidly to fix...",
    "toast.match": "Nice! +{points} pts",
    "toast.feverStart": "Appeal Time Start!",
    "toast.feverLevelUp": "RECOGNITION LEVEL UP!",
    "toast.feverEnd": "Appeal Time End!",
    "share.template":
      'Ota Level "{levelName}"! Total score {score}!\nGot {responses} responses from my idol 😭💕 #OshiLightLIVE #IdolLive',
    "penlight.off": "OFF",
    "transition.resultTitle": "RESULT!!",
    "transition.resultSubtitle": "What’s Your Ota Level??",
    "howto.section.basics.title": "⭐ Basic Controls",
    "howto.section.basics.item1": "・After the game starts, check the TARGET COLOR.",
    "howto.section.basics.item2": "・Use the left/right buttons to change your lightstick color and match it to the TARGET COLOR to earn points.",
    "howto.section.basics.item3": "・Match 3 times within 2 seconds to activate Appeal Time.",
    "howto.section.fever.title": "⭐ Appeal Time",
    "howto.section.fever.item1": "・Swipe left and right to swing your lightstick. Every 10 swings gives you +10 pt, and your Oshi’s reaction animation levels up.",
    "howto.section.fever.item2": "・Appeal Time lasts for 10 seconds, and the main timer pauses during this mode.",
    "howto.section.fever.item3": "・When it ends, the game automatically returns to normal play.",
    "howto.section.scoring.title": "⭐ Normal Mode Scoring (per successful match)",
    "howto.section.scoring.item1": "・EASY: +6 pts",
    "howto.section.scoring.item2": "・NORMAL: +10 pts",
    "howto.section.scoring.item3": "・HARD: +13 pts",
    "howto.section.feverScoring.title": "Appeal Time Scoring",
    "howto.section.feverScoring.item1": "Earn +10 pts for every 10 swings.",
    "howto.section.feverScoring.item2": "Responses also increase, making the stage effects flashier.",
    "ranking.form.usernamePlaceholder": "e.g. John Doe",
    "ranking.form.handlePlaceholder": "e.g. oshi_light (@ is added automatically)",
  },
  ko: {
    "hero.title": "오시 라이트 LIVE!!",
    "hero.subtitle": "응원봉을 맞추고 오시의 레스를 잡아라!🔥",
    "top.start": "게임 시작",
    "top.howto": "조작 안내",
    "top.ranking": "랭킹 보기",
    "ranking.title": "🏆 랭킹",
    "ranking.description": "닉네임을 입력하고 랭킹에 참여하세요!",
    "ranking.submitTitle": "스코어 등록",
    "ranking.form.usernameLabel": "닉네임",
    "ranking.form.handleLabel": "X 계정",
    "ranking.form.handleOptional": "(선택)",
    "ranking.form.handleHint": "X ID를 입력하면 친구들이 계정을 확인할 수 있어요!",
    "ranking.form.submit": "랭킹에 등록",
    "ranking.form.success": "등록 완료! 반짝반짝!",
    "ranking.form.error": "등록에 실패했습니다. 잠시 후 다시 시도해주세요.",
    "ranking.submit.inProgress": "전송 중...",
    "ranking.form.validationHandle": "@ID는 영문, 숫자, 밑줄만 사용할 수 있습니다.",
    "ranking.form.validationMissingScore": "최근 스코어가 없습니다. 플레이 후 등록해주세요.",
    "ranking.noScore": "최근 스코어가 없습니다. 게임을 플레이하고 결과를 등록해보세요!",
    "ranking.ready": "유저명과 @ID를 입력하고 랭킹에 등록해보세요!",
    "ranking.currentScoreLabel": "이번 스코어",
    "ranking.currentLevelLabel": "오타 레벨",
    "ranking.list.title": "Top 500",
    "ranking.list.empty": "아직 등록된 기록이 없습니다.",
    "ranking.list.position": "{rank} 위",
    "ranking.list.more": "상위 500위까지만 표시됩니다.",
    "ranking.anonymous": "익명 오타쿠",
    "ranking.loading": "불러오는 중...",
    "ranking.disabled": "랭킹 기능을 사용할 수 없습니다. 환경 변수를 설정해주세요.",
    "ranking.notice": "동점일 경우 먼저 등록한 기록이 상위에 표시됩니다.",
    "ranking.personal.title": "나의 순위",
    "ranking.personal.unavailable": "아직 등록된 스코어가 없습니다.",
    "ranking.personal.outside": "500위 밖이지만, 현재 순위는 {rank} 위입니다.",
    "ranking.personal.latestScore": "최신 스코어",
    "ranking.personal.latestLevel": "오타 레벨",
    "ranking.personal.deleteLatest": "최신 기록 삭제",
    "ranking.personal.deleteConfirm": "최신 기록을 삭제할까요? (되돌릴 수 없습니다)",
    "ranking.personal.deleteSuccess": "삭제되었습니다.",
    "ranking.personal.deleteError": "삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
    "ranking.personal.allEntries": "나의 기록",
    "ranking.personal.deleteEntryConfirm": "이 기록을 삭제할까요? (되돌릴 수 없습니다)",
    "settings.title": "난이도 · 설정",
    "mode.easy.title": "🔰EASY",
    "mode.easy.desc": "+6점 / 색상 예시가 있는 연습 모드!",
    "mode.normal.title": "⚡NORMAL",
    "mode.normal.desc": "+10점 / 색 순서를 외우고 진짜 승부!",
    "mode.hard.title": "🔥HARD",
    "mode.hard.desc": "+13점 / 버튼 오류를 뚫고 최고 점수 도전!",
    "howto.title": "🎮 조작 가이드",
    "howto.step1": "시작 후 상단의 목표 색을 확인하세요.",
    "howto.step2": "좌우 버튼으로 펜라이트를 돌려 색을 맞춥니다.",
    "howto.step3": "2초 안에 3회 연속 성공 시 피버 타임 진입!",
    "howto.step4": "피버 중에는 좌우 스와이프로 포인트와 레스를 모으세요.",
    "howto.imageNote": "조작 설명 이미지는 추후 교체 예정",
    "hud.scoreLabel": "스코어",
    "hud.successLabel": "성공 횟수",
    "hud.timeLabel": "남은 시간",
    "target.title": "TARGET COLOR",
    "controls.turnLeft": "왼쪽 회전",
    "controls.turnRight": "오른쪽 회전",
    "play.showResult": "종료하기",
    "play.pause": "중단하기",
    "play.resume": "재개하기",
    "play.retry": "다시 플레이",
    "play.toTop": "처음으로 돌아가기",
    "fever.title": "어필 타임!",
    "fever.message": "응원봉을 힘껏 흔들어서 폭레스를 받아라!",
    "fever.swipe": "좌우로 스와이프!",
    "fever.timerUnit": "초",
    "fever.countUnit": "회",
    "fever.stage": "인지도 Lv.{level}",
    "result.title": "라이브 결과",
    "result.scoreLabel": "토탈 스코어",
    "result.levelLabel": "오타 레벨",
    "result.successLabel": "성공 횟수",
    "result.responsesLabel": "레스 획득수",
    "share.button": "X에 공유",
    "share.note": "스크린샷을 첨부하면 더 빛나요!✨",
    "history.title": "최근 스코어",
    "history.empty": "첫 플레이를 기록해보자!",
    "history.pointsUnit": "점",
    "toast.glitch": "버튼이 고장났어! 연타해서 복구하자…",
    "toast.match": "좋아! +{points}점",
    "toast.feverStart": "어필타임 시작!",
    "toast.feverLevelUp": "인지도 레벨업!",
    "toast.feverEnd": "어필타임 끝!",
    "share.template":
      '오타쿠 레벨 "{levelName}"! 토탈 스코어 {score}!\n{responses}번 오시에게서 레스를 받았어 😭💕 #오시라이트LIVE #아이돌라이브',
    "penlight.off": "OFF",
    "transition.resultTitle": "결과 발표✨",
    "transition.resultSubtitle": "당신의 오타 레벨은??",
    "howto.section.basics.title": "⭐ 기본 조작",
    "howto.section.basics.item1": "・시작 후 \"TARGET COLOR\"를 확인하세요.",
    "howto.section.basics.item2": "・좌우 버튼으로 응원봉 색을 변경해 \"TARGET COLOR\"와 일치시키면 점수를 얻습니다.",
    "howto.section.basics.item3": "・2초 안에 3회 성공하면 어필 타임이 시작됩니다.",
    "howto.section.fever.title": "⭐ 어필 타임",
    "howto.section.fever.item1": "・좌우 스와이프로 응원봉을 흔들면 10번마다 +10pt를 획득하고, 오시의 레스 연출도 레벨업됩니다.",
    "howto.section.fever.item2": "・어필 타임은 10초간 유지되며, 그동안 메인 타이머는 일시 정지됩니다.",
    "howto.section.fever.item3": "・종료 후 자동으로 일반 모드로 돌아갑니다.",
    "howto.section.scoring.title": "⭐ 일반 모드 점수 (1회 성공 기준)",
    "howto.section.scoring.item1": "・EASY：+6pt",
    "howto.section.scoring.item2": "・NORMAL：+10pt",
    "howto.section.scoring.item3": "・HARD：+13pt",
    "howto.section.feverScoring.title": "어필 타임 점수",
    "howto.section.feverScoring.item1": "좌우 스와이프 10회마다 +10점을 획득합니다.",
    "howto.section.feverScoring.item2": "동시에 레스 획득수도 늘어나 연출이 더욱 화려해집니다.",
    "ranking.form.usernamePlaceholder": "예시: 홍길동",
    "ranking.form.handlePlaceholder": "예시: oshi_light（@는 자동으로 붙어요）",
  },
};

const createI18n = () => {
  const STORAGE_KEY = "oshiLang";
  const SUPPORTED_LANGUAGES = ["ja", "en", "ko"];
  let currentLang = loadLanguage();

  function loadLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn("Language preference read failed:", error);
    }
    return "ja";
  }

  function saveLanguage(nextLang) {
    try {
      localStorage.setItem(STORAGE_KEY, nextLang);
    } catch (error) {
      console.warn("Language preference write failed:", error);
    }
  }

  const translateTemplate = (template, params = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(params, key) ? params[key] : `{${key}}`
    );

  const translate = (key, params = {}) => {
    const activePack = TRANSLATIONS[currentLang] || TRANSLATIONS.ja;
    const fallback = TRANSLATIONS.ja || {};
    let template = activePack[key];
    if (template === undefined || template === null) {
      template = fallback[key];
    }
    if (template === undefined || template === null) {
      template = key;
    }
    return translateTemplate(template, params);
  };

  const setLanguage = (lang) => {
    const nextLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : "ja";
    currentLang = nextLang;
    saveLanguage(nextLang);
    document.documentElement.setAttribute("lang", nextLang);
    return currentLang;
  };

  const getLanguage = () => currentLang;

  return {
    t: translate,
    setLanguage,
    getLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

/* ==========================================================================
   3. GAME STATE
   ========================================================================== */

const noop = () => {};

const defaultEffects = {
  onPause: noop,
  onResume: noop,
  onHudFlash: noop,
  onTargetFlash: noop,
  onMatchToast: noop,
  onGlitchToast: noop,
  onFeverStart: noop,
  onFeverLevelUp: noop,
  onFeverEnd: noop,
  onFeverSwing: noop,
  onTransitionStart: noop,
  onTransitionComplete: noop,
};

class GameStore {
  constructor({ colors, modeScore, t, random = Math.random, effects = {} }) {
    this.colors = colors;
    this.modeScore = modeScore;
    this.translate = t;
    this.random = random;
    this.effects = { ...defaultEffects, ...effects };

    this.initialState = {
      mode: "easy",
      timeLeft: 40,
      score: 0,
      successCount: 0,
      streak: 0,
      paused: false,
      currentIndex: null,
      targetIndex: 0,
      responses: 0,
      lastSuccessTimes: [],
      fever: { active: false, timeLeft: 10, swingCount: 0, responseStage: 0 },
      isTransitioning: false,
      hardGlitch: { cooling: false, pendingPresses: 0, timerId: null },
      timers: { main: null, fever: null },
    };
    this.state = deepClone(this.initialState);
    this.listeners = new Set();
    this.transitionTimeout = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  set(partial) {
    this.state = { ...this.state, ...partial };
    this.emit();
  }

  update(mapper) {
    this.state = mapper({ ...this.state });
    this.emit();
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  reset() {
    this.clearTimers();
    const existingTimer =
      this.state && this.state.hardGlitch ? this.state.hardGlitch.timerId : undefined;
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    this.state = deepClone(this.initialState);
    this.state.targetIndex = this.randomTargetIndex();
    this.emit();
  }

  randomTargetIndex() {
    return Math.floor(this.random() * this.colors.length);
  }

  start(mode) {
    this.reset();
    this.update((state) => ({
      ...state,
      mode,
      timeLeft: 40,
      currentIndex: null,
      targetIndex: this.randomTargetIndex(),
      paused: false,
    }));
    this.startMainTimer();
  }

  startMainTimer() {
    this.clearTimer("main");
    const tick = () => {
      this.update((state) => {
        if (state.paused) return state;
        if (state.fever.active) return state;
        const nextTime = state.timeLeft - 1;
        if (nextTime <= 0) {
          this.finish();
          return { ...state, timeLeft: 0 };
        }
        return { ...state, timeLeft: nextTime };
      });
    };
    this.state.timers.main = setInterval(tick, 1000);
  }

  clearTimer(key) {
    if (this.state.timers[key]) {
      clearInterval(this.state.timers[key]);
      this.state.timers[key] = null;
    }
  }

  clearTimers() {
    Object.keys(this.state.timers).forEach((key) => this.clearTimer(key));
  }

  togglePause() {
    if (this.state.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  pause() {
    if (this.state.paused) return;
    this.effects.onPause(this.state);
    this.clearTimers();
    this.update((state) => ({
      ...state,
      paused: true,
      timers: { ...state.timers, main: null, fever: null },
    }));
  }

  resume() {
    if (!this.state.paused) return;
    this.update((state) => ({
      ...state,
      paused: false,
    }));
    if (this.state.fever.active) {
      this.startFeverTimer();
    } else if (this.state.timeLeft > 0) {
      this.startMainTimer();
    }
    this.effects.onResume(this.state);
  }

  rotate(direction) {
    let matched = false;
    this.update((state) => {
      if (state.paused) return state;
      if (state.fever.active) return state;

      let workingState = state;
      if (state.mode === "hard" && workingState.currentIndex !== null) {
        const handled = this.handleHardGlitch(state);
        workingState = handled.state;
        if (handled.skip) {
          return workingState;
        }
      }

      let nextIndex;
      if (workingState.currentIndex === null) {
        nextIndex = 0;
      } else {
        nextIndex =
          (workingState.currentIndex + direction + this.colors.length) %
          this.colors.length;
      }

      matched = nextIndex === workingState.targetIndex;
      return { ...workingState, currentIndex: nextIndex };
    });

    if (matched) {
      this.handleMatch();
    }
  }

  handleHardGlitch(state) {
    const glitch = { ...state.hardGlitch };
    let skip = false;

    if (glitch.pendingPresses > 0) {
      glitch.pendingPresses -= 1;
      skip = true;
    } else if (!glitch.cooling && this.random() < 0.25) {
      glitch.pendingPresses = Math.floor(this.random() * 3) + 2;
      glitch.cooling = true;
      skip = true;
      glitch.timerId = setTimeout(() => {
        this.update((s) => ({
          ...s,
          hardGlitch: { ...s.hardGlitch, cooling: false, timerId: null },
        }));
      }, 2000);
      this.effects.onGlitchToast({
        message: this.translate("toast.glitch"),
        variant: "danger",
      });
    }

    return {
      state: { ...state, hardGlitch: glitch },
      skip,
    };
  }

  handleMatch() {
    const { mode } = this.state;
    const points = this.modeScore[mode] || 0;
    const now = Date.now();

    this.update((state) => {
      const lastSuccessTimes = [...state.lastSuccessTimes, now].filter(
        (t) => now - t <= 2000
      );
      const streak = state.streak + 1;
      const newScore = state.score + points;
      const successCount = state.successCount + 1;

      return {
        ...state,
        score: newScore,
        successCount,
        streak,
        lastSuccessTimes,
        targetIndex: this.randomTargetIndex(),
      };
    });

    this.effects.onHudFlash();
    this.effects.onTargetFlash();

    if (!this.state.fever.active) {
      this.effects.onMatchToast({
        message: this.translate("toast.match", { points }),
        variant: "success",
        options: { placement: "stage" },
      });
    }

    const { fever, lastSuccessTimes, streak } = this.state;
    if (!fever.active && lastSuccessTimes.length >= 3 && streak >= 3) {
      this.enterFever();
    }
  }

  enterFever() {
    this.update((state) => ({
      ...state,
      fever: {
        active: true,
        timeLeft: 10,
        swingCount: 0,
        responseStage: 0,
      },
    }));
    this.clearTimer("main");
    this.startFeverTimer();
    this.effects.onFeverStart({
      message: this.translate("toast.feverStart"),
    });
  }

  startFeverTimer() {
    this.clearTimer("fever");
    this.state.timers.fever = setInterval(() => {
      this.update((state) => {
        if (!state.fever.active) return state;
        if (state.paused) return state;
        const nextTime = state.fever.timeLeft - 1;
        if (nextTime <= 0) {
          this.exitFever();
          return {
            ...state,
            fever: { ...state.fever, active: false, timeLeft: 0 },
          };
        }
        return {
          ...state,
          fever: { ...state.fever, timeLeft: nextTime },
        };
      });
    }, 1000);
  }

  swing(direction) {
    if (!this.state.fever.active || this.state.paused) return;
    this.update((state) => {
      const swingCountRaw = state.fever.swingCount + 1;
      const completedRoundTrip = swingCountRaw % 2 === 0;
      const roundTripCount = Math.floor(swingCountRaw / 2);
      if (completedRoundTrip) {
        this.effects.onFeverSwing({ roundTripCount });
      }
      const previousRoundTrips = Math.floor(state.fever.swingCount / 2);
      let { responseStage } = state.fever;
      let score = state.score;
      let responses = state.responses;

      if (completedRoundTrip && roundTripCount > 0 && roundTripCount % 10 === 0) {
        score += 10;
        responses += 1;
      }

      if (
        completedRoundTrip &&
        roundTripCount > 0 &&
        roundTripCount % 10 === 0 &&
        previousRoundTrips % 10 !== 0
      ) {
        responseStage += 1;
        this.effects.onFeverLevelUp({
          message: this.translate("toast.feverLevelUp"),
          level: responseStage,
        });
      }

      return {
        ...state,
        score,
        responses,
        fever: {
          ...state.fever,
          swingCount: swingCountRaw,
          responseStage: responseStage,
        },
      };
    });
  }

  exitFever() {
    this.clearTimer("fever");
    this.update((state) => ({
      ...state,
      fever: {
        ...state.fever,
        active: false,
        timeLeft: 10,
        swingCount: 0,
        responseStage: 0,
      },
      streak: 0,
      lastSuccessTimes: [],
    }));
    this.startMainTimer();
    this.effects.onFeverEnd({
      message: this.translate("toast.feverEnd"),
    });
  }

  finish() {
    this.clearTimers();
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.update((state) => ({
      ...state,
      paused: false,
      timers: { ...state.timers, main: null, fever: null },
      isTransitioning: true,
    }));
    this.effects.onTransitionStart();
    const transitionDuration = 1000;
    const finalizeResult = () => {
      this.update((state) => ({
        ...state,
        isTransitioning: false,
      }));
      this.effects.onTransitionComplete(this.state);
    };
    this.transitionTimeout = setTimeout(finalizeResult, transitionDuration);
  }
}

/* ==========================================================================
   4. MAIN APP LOGIC
   ========================================================================== */

/* --- Supabase Setup --- */
const SUPABASE_URL_FALLBACK = "https://cznwtorlerzmstnohzpq.supabase.co";
const SUPABASE_ANON_KEY_FALLBACK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bnd0b3JsZXJ6bXN0bm9oenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDE2NTQsImV4cCI6MjA3OTIxNzY1NH0.Uc8GakAYzlqZCV-LstJl_Xx7Kj3j_CXj7Z3GHsvqvlc";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_FALLBACK;

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const RANKING_TABLE = "rankings";
const PLAYER_ID_STORAGE_KEY = "oshi-player-id";

const getOrCreatePlayerId = () => {
  try {
    const stored = localStorage.getItem(PLAYER_ID_STORAGE_KEY);
    if (stored) return stored;
    const generated = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(PLAYER_ID_STORAGE_KEY, generated);
    return generated;
  } catch (error) {
    console.warn("Failed to access localStorage for player id:", error);
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

const playerId = getOrCreatePlayerId();
const isRankingEnabled = Boolean(supabase);

/* --- Audio System --- */
// Updated paths to match "sounds" directory
const BGM_MENU = new Audio(resolveAsset("sounds/menu.mp3"));
BGM_MENU.loop = true;
BGM_MENU.volume = 0.4;

const BGM_GAME = new Audio(resolveAsset("sounds/play.mp3"));
BGM_GAME.loop = true;
BGM_GAME.volume = 0.4;

// SFX Mapping
const SFX_BUTTON = new Audio(resolveAsset("sounds/arrow.mp3")); // fallback if start.mp3 not desired for generic
const SFX_START = new Audio(resolveAsset("sounds/start.mp3"));
const SFX_ARROW = new Audio(resolveAsset("sounds/arrow.mp3"));
const SFX_END = new Audio(resolveAsset("sounds/end.mp3")); 
const SFX_PAUSE = new Audio(resolveAsset("sounds/pause.mp3"));
const SFX_MAIN = new Audio(resolveAsset("sounds/main.mp3")); 
const SFX_LIGHTSTICK = new Audio(resolveAsset("sounds/Lightstick.mp3"));
const SFX_ARIGATO = new Audio(resolveAsset("sounds/arigato.mp3"));
const SFX_HAKUSHU = new Audio(resolveAsset("sounds/hakushu.mp3"));
const SFX_APPEAL = new Audio(resolveAsset("sounds/AppealTime.mp3"));

let currentBgm = null;
let isBgmUnlocked = false;

const initAudio = () => {
  // Preload critical audio
  [BGM_MENU, BGM_GAME, SFX_END, SFX_START].forEach(a => a.load());
};

const unlockBgm = () => {
  if (isBgmUnlocked) return;
  isBgmUnlocked = true;
  [BGM_MENU, BGM_GAME, SFX_END].forEach((audio) => {
    // Mute, play, pause to unlock
    const originalVolume = audio.volume;
    audio.volume = 0;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = originalVolume;
    }).catch((e) => console.warn("Audio unlock failed", e));
  });
};

const stopAllBgm = () => {
  [BGM_MENU, BGM_GAME, SFX_END, SFX_APPEAL].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  currentBgm = null;
};

const playBgm = (audioObj) => {
  if (!isBgmUnlocked) return;
  if (currentBgm === audioObj && !audioObj.paused) return;
  
  stopAllBgm();
  currentBgm = audioObj;
  audioObj.play().catch(e => console.warn("BGM play failed:", e));
};

// SFX Functions
const playSfx = (audioObj) => {
  if (!isBgmUnlocked) return;
  // For simple SFX, cloning is good for overlapping sounds
  const clone = audioObj.cloneNode();
  clone.volume = audioObj.volume || 1.0;
  clone.play().catch(e => console.warn("SFX play failed:", e));
};

const playButtonSfx = () => playSfx(SFX_BUTTON);
const playStartSfx = () => playSfx(SFX_START);
const playArrowSfx = () => playSfx(SFX_ARROW);
const playPauseSfx = () => playSfx(SFX_PAUSE);
const playMainSfx = () => playSfx(SFX_MAIN); 
const playLightstickSfx = () => playSfx(SFX_LIGHTSTICK);
const playArigatoSfx = () => playSfx(SFX_ARIGATO);
const playHakushuSfx = () => playSfx(SFX_HAKUSHU);
const playAppealTimeSfx = () => {
  // Appeal Time BGM is long, treat it like BGM but overlay?
  // Or just play it. If it's BGM-like, we might want to stop main BGM?
  // Game says "main timer pauses".
  // Let's pause Game BGM and play Appeal BGM?
  // Current logic keeps Game BGM running? 
  // Original code had `playAppealTimeSfx`.
  // If it's BGM, we should handle it carefully.
  // Based on file name AppealTime.mp3, it's likely a track.
  
  // Pause current BGM
  if (currentBgm) currentBgm.pause();
  
  SFX_APPEAL.currentTime = 0;
  SFX_APPEAL.volume = 0.6;
  SFX_APPEAL.play().catch(e => console.warn(e));
};

// Special case for End/Result BGM
const playEndSfx = () => {
  stopAllBgm(); 
  currentBgm = SFX_END;
  SFX_END.loop = false; 
  SFX_END.play().catch(e => console.warn("End SFX failed:", e));
};


/* --- I18n Setup --- */
const { t, setLanguage, getLanguage, supportedLanguages } = createI18n();
let langButtons = [];


/* --- UI Elements --- */
const screens = {
  top: document.getElementById("screen-top"),
  game: document.getElementById("screen-game"),
  result: document.getElementById("screen-result"),
  history: document.getElementById("screen-history"),
};

const hud = {
  score: document.getElementById("hud-score"),
  success: document.getElementById("hud-success"),
  timer: document.getElementById("hud-timer"),
  targetText: document.getElementById("target-text"),
  penlight: document.getElementById("penlight"),
  penlightColor: document.querySelector(".penlight__color"),
  messageArea: document.getElementById("message-area"),
  feverOverlay: document.getElementById("fever-overlay"),
  feverText: document.getElementById("fever-text"),
};

const buttons = {
  start: document.getElementById("btn-start"),
  howto: document.getElementById("btn-howto"),
  ranking: document.getElementById("btn-ranking"),
  rankingResult: document.getElementById("btn-ranking-result"),
  left: document.getElementById("btn-left"),
  right: document.getElementById("btn-right"),
  showResult: document.getElementById("btn-show-result"),
  pause: document.getElementById("btn-pause"),
  resume: document.getElementById("btn-resume"),
  retry: document.getElementById("btn-retry"),
  top: document.getElementById("btn-top"),
  share: document.getElementById("btn-share"),
  closeRanking: document.getElementById("btn-close-ranking"),
  submitRanking: document.getElementById("ranking-submit-button"),
};

const modals = {
  howto: document.getElementById("modal-howto"),
  pause: document.getElementById("modal-pause"),
  ranking: document.getElementById("ranking-modal"),
};

const closeButtons = document.querySelectorAll(".modal-close");

/* --- Ranking State --- */
let latestResultState = null;
let rankingEntriesCache = [];
let personalEntriesCache = [];
let latestPersonalEntry = null;
let isRankingRefreshing = false;
let rankingStatusState = "idle";

/* --- Game Store Initialization --- */
const store = new GameStore({
  colors: PENLIGHT_COLORS,
  modeScore: MODE_SCORE,
  t,
  effects: {
    onPause: () => {
      playPauseSfx();
      modals.pause.hidden = false;
    },
    onResume: () => {
      playPauseSfx();
      modals.pause.hidden = true;
    },
    onHudFlash: () => {
      hud.score.classList.remove("hud__value--pop");
      void hud.score.offsetWidth;
      hud.score.classList.add("hud__value--pop");
    },
    onTargetFlash: () => {
      hud.targetText.classList.remove("target-display__text--flash");
      void hud.targetText.offsetWidth;
      hud.targetText.classList.add("target-display__text--flash");
    },
    onMatchToast: ({ message, variant, options }) => {
      playArrowSfx();
      showToast(message, variant, options);
    },
    onGlitchToast: ({ message, variant }) => {
      showToast(message, variant);
    },
    onFeverStart: ({ message }) => {
      playAppealTimeSfx();
      showToast(message, "warning");
      hud.feverOverlay.hidden = false;
      hud.feverText.textContent = message;
    },
    onFeverLevelUp: ({ message, level }) => {
      playMainSfx();
      showToast(message, "success");
      
      const imageIndex = Math.min(level - 1, appealImageSources.length - 1);
      const nextSrc = appealImageSources[imageIndex];
      
      if (nextSrc) {
        const img = document.createElement("img");
        img.src = nextSrc;
        img.className = "fever-reaction-image";
        hud.feverOverlay.appendChild(img);
        setTimeout(() => img.remove(), 1000);
      }
    },
    onFeverSwing: ({ roundTripCount }) => {
      playLightstickSfx();
    },
    onFeverEnd: ({ message }) => {
      // Resume game BGM
      if (currentBgm && currentBgm === BGM_GAME) {
        currentBgm.play().catch(() => {});
      }
      SFX_APPEAL.pause();
      
      showToast(message, "info");
      hud.feverOverlay.hidden = true;
      hud.feverText.textContent = "";
    },
    onTransitionStart: () => {
      playArigatoSfx();
      playHakushuSfx();
      // Stop appeal/game BGM
      if (currentBgm) currentBgm.pause();
      SFX_APPEAL.pause();
    },
    onTransitionComplete: (finalState) => {
      latestResultState = finalState; 
      playEndSfx(); 
      showResultScreen(finalState);
    },
  },
});

store.subscribe(render);

/* --- Event Listeners --- */

// Start
buttons.start.addEventListener("click", () => {
  unlockBgm();
  playButtonSfx();
  startGame("normal");
});

// How to
buttons.howto.addEventListener("click", () => {
  playButtonSfx();
  modals.howto.hidden = false;
});

// Controls
buttons.left.addEventListener("click", () => {
  // playArrowSfx(); // onMatchToast handles this? No, rotation sound.
  playArrowSfx();
  store.rotate(-1);
});
buttons.right.addEventListener("click", () => {
  playArrowSfx();
  store.rotate(1);
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (screens.game.hidden) return;
  if (e.key === "ArrowLeft") {
    store.rotate(-1);
  } else if (e.key === "ArrowRight") {
    store.rotate(1);
  }
});

// Pause/Resume/Retry
buttons.pause.addEventListener("click", () => store.togglePause());
buttons.resume.addEventListener("click", () => store.resume());
buttons.showResult.addEventListener("click", () => {
  store.finish(); 
  modals.pause.hidden = true;
});
buttons.retry.addEventListener("click", () => {
  playButtonSfx();
  startGame(store.state.mode);
});
buttons.top.addEventListener("click", () => {
  playButtonSfx();
  showTopScreen();
});

// Share
buttons.share.addEventListener("click", () => {
  playButtonSfx();
  shareResult(store.state);
});

// Ranking
buttons.ranking.addEventListener("click", () => {
  playButtonSfx();
  openRankingModal();
});
buttons.rankingResult.addEventListener("click", () => {
  playButtonSfx();
  openRankingModal();
});
buttons.closeRanking.addEventListener("click", () => {
  playButtonSfx();
  closeRankingModal();
});
buttons.submitRanking.addEventListener("click", (e) => {
  e.preventDefault();
  playButtonSfx();
  handleRankingSubmit();
});

// Close Modals
closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    playButtonSfx();
    const modal = btn.closest(".ranking-modal") || btn.closest(".modal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("modal-open");
  });
});

// Language Switcher
const initLanguageButtons = () => {
  const container = document.getElementById("lang-buttons");
  if (!container) return;
  container.innerHTML = "";
  
  supportedLanguages.forEach((lang) => {
    const btn = document.createElement("button");
    btn.className = "lang-button";
    btn.textContent = lang.toUpperCase();
    btn.dataset.lang = lang;
    if (lang === getLanguage()) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      playButtonSfx();
      const newLang = setLanguage(lang);
      updateLanguageUI(newLang);
    });
    container.appendChild(btn);
  });
};

const updateLanguageUI = (lang) => {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  const usernameInput = document.getElementById("ranking-username");
  const handleInput = document.getElementById("ranking-handle");
  if (usernameInput) usernameInput.placeholder = t("ranking.form.usernamePlaceholder");
  if (handleInput) handleInput.placeholder = t("ranking.form.handlePlaceholder");

  document.querySelectorAll(".lang-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  if (!modals.ranking.hidden) {
    renderRankingList(rankingEntriesCache);
    renderRankingPersonal(personalEntriesCache);
  }
};

/* --- Swipe Logic (Fever) --- */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  if (store.state.fever.active) {
    e.preventDefault(); 
  }
}, { passive: false });

document.addEventListener("touchend", (e) => {
  if (!store.state.fever.active) return;
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
    store.swing(diffX > 0 ? 1 : -1);
  }
});


/* --- Render Functions --- */

function render(state) {
  hud.score.textContent = state.score;
  hud.success.textContent = state.successCount;
  hud.timer.textContent = state.timeLeft;

  const targetColor = store.colors[state.targetIndex];
  if (targetColor) {
    hud.targetText.textContent = targetColor.name;
    hud.targetText.style.color = targetColor.code;
    hud.targetText.style.textShadow = `0 0 10px ${targetColor.code}`;
  }

  if (state.currentIndex !== null) {
    const currentColor = store.colors[state.currentIndex];
    hud.penlightColor.style.backgroundColor = currentColor.code;
    hud.penlightColor.style.boxShadow = `0 0 20px ${currentColor.code}, 0 0 40px ${currentColor.code}`;
  } else {
    hud.penlightColor.style.backgroundColor = "#333";
    hud.penlightColor.style.boxShadow = "none";
  }

  if (state.fever.active) {
    hud.feverOverlay.hidden = false;
    hud.feverText.innerHTML = `${t("fever.title")}<br>${state.fever.timeLeft} ${t("fever.timerUnit")}`;
  } else {
    hud.feverOverlay.hidden = true;
  }
}

function showToast(message, variant = "info", options = {}) {
  const toast = document.createElement("div");
  toast.className = `toast toast--${variant}`;
  toast.textContent = message;
  
  if (options.placement === "stage") {
    toast.style.top = "40%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
  }

  hud.messageArea.appendChild(toast);
  
  void toast.offsetWidth;
  toast.classList.add("toast--show");

  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/* --- Screen Navigation --- */

function showTopScreen() {
  stopAllBgm();
  playBgm(BGM_MENU);
  
  screens.top.hidden = false;
  screens.game.hidden = true;
  screens.result.hidden = true;
  screens.history.hidden = true;
  
  document.body.classList.remove("modal-open");
}

function startGame(mode) {
  stopAllBgm();
  playBgm(BGM_GAME);

  screens.top.hidden = true;
  screens.game.hidden = false;
  screens.result.hidden = true;
  
  store.start(mode);
}

function showResultScreen(state) {
  screens.game.hidden = true;
  screens.result.hidden = false;

  const levelData = getLevelData(state.score);
  
  document.getElementById("result-score").textContent = state.score;
  document.getElementById("result-level").textContent = levelData.names[getLanguage()] || levelData.name;
  document.getElementById("result-success").textContent = state.successCount;
  document.getElementById("result-responses").textContent = state.responses;
  
  const currentScoreDisplay = document.getElementById("ranking-current-score");
  const currentLevelDisplay = document.getElementById("ranking-current-level");
  if (currentScoreDisplay) currentScoreDisplay.textContent = state.score;
  if (currentLevelDisplay) currentLevelDisplay.textContent = levelData.names[getLanguage()];
}

function getLevelData(score) {
  return LEVEL_TABLE.find((l) => score <= l.max) || LEVEL_TABLE[LEVEL_TABLE.length - 1];
}

function shareResult(state) {
  const levelData = getLevelData(state.score);
  const text = t("share.template", {
    levelName: levelData.names[getLanguage()],
    score: state.score,
    responses: state.responses,
  });
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}


/* --- Ranking Logic --- */

async function fetchRankingList() {
  if (!supabase) return;
  const listEl = document.getElementById("ranking-list");
  listEl.innerHTML = `<li class="ranking-list__loading">${t("ranking.loading")}</li>`;

  const { data, error } = await supabase
    .from(RANKING_TABLE)
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    console.error("Ranking fetch error:", error);
    listEl.textContent = t("ranking.disabled");
    return;
  }

  rankingEntriesCache = data || [];
  renderRankingList(rankingEntriesCache);
}

async function fetchPersonalHistory() {
  if (!supabase || !playerId) return;
  const personalEl = document.getElementById("ranking-personal");
  personalEl.innerHTML = `<p class="ranking-loading">${t("ranking.loading")}</p>`;

  const { data, error } = await supabase
    .from(RANKING_TABLE)
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Personal history fetch error:", error);
    return;
  }

  personalEntriesCache = data || [];
  if (personalEntriesCache.length > 0) {
    latestPersonalEntry = personalEntriesCache[0];
  } else {
    latestPersonalEntry = null;
  }
  renderRankingPersonal(personalEntriesCache);
}

function renderRankingList(entries) {
  const listEl = document.getElementById("ranking-list");
  listEl.innerHTML = "";

  if (entries.length === 0) {
    listEl.innerHTML = `<li class="ranking-list__empty">${t("ranking.list.empty")}</li>`;
    return;
  }

  entries.forEach((entry, index) => {
    const rank = index + 1;
    const li = document.createElement("li");
    li.className = `ranking-list__item rank-${rank}`;
    
    const date = new Date(entry.created_at).toLocaleDateString();
    const levelKey = getLanguage() === "ja" ? "ota_level_ja" : getLanguage() === "en" ? "ota_level_en" : "ota_level_ko";
    const levelName = entry[levelKey] || entry.ota_level_ja || "-";
    
    let handleHtml = "";
    if (entry.handle) {
        const handleLink = `https://x.com/${entry.handle}`;
        handleHtml = `<a class="ranking-list__handle" href="${handleLink}" target="_blank" rel="noopener noreferrer">@${entry.handle}</a>`;
    }

    li.innerHTML = `
      <div class="ranking-list__rank">${rank}</div>
      <div class="ranking-list__info">
        <div class="ranking-list__main">
            <span class="ranking-list__name">${entry.username || t("ranking.anonymous")}</span>
            ${handleHtml}
        </div>
        <div class="ranking-list__sub">
            <span class="ranking-list__level">${levelName}</span>
            <span class="ranking-list__date">${date}</span>
        </div>
      </div>
      <div class="ranking-list__score">${entry.score}</div>
    `;
    listEl.appendChild(li);
  });
}

function renderRankingPersonal(entries) {
  const container = document.getElementById("ranking-personal");
  container.innerHTML = "";

  if (!entries || entries.length === 0) {
    container.innerHTML = `<p class="ranking-personal__empty">${t("ranking.personal.unavailable")}</p>`;
    return;
  }

  const title = document.createElement("h4");
  title.className = "ranking-personal__history-title";
  title.textContent = t("ranking.personal.allEntries");
  container.appendChild(title);

  const list = document.createElement("ul");
  list.className = "ranking-personal__list";

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "ranking-personal__item";

    const date = new Date(entry.created_at).toLocaleString();
    const levelKey = getLanguage() === "ja" ? "ota_level_ja" : getLanguage() === "en" ? "ota_level_en" : "ota_level_ko";
    const levelName = entry[levelKey] || entry.ota_level_ja || "-";

    li.innerHTML = `
      <div class="ranking-personal__info">
        <div class="ranking-personal__score">${t("ranking.personal.latestScore")}: ${entry.score}</div>
        <div class="ranking-personal__meta">
            <span>${levelName}</span>
            <span class="ranking-personal__date">${date}</span>
        </div>
      </div>
      <button class="ranking-personal__delete-btn" data-id="${entry.id}" title="${t("ranking.personal.deleteLatest")}">
        🗑️
      </button>
    `;

    const deleteBtn = li.querySelector(".ranking-personal__delete-btn");
    deleteBtn.addEventListener("click", async () => {
        if (confirm(t("ranking.personal.deleteEntryConfirm"))) {
            await deleteRankingEntry(entry.id);
        }
    });

    list.appendChild(li);
  });

  container.appendChild(list);
}

async function handleRankingSubmit() {
  if (!store.state.score && !latestResultState) {
    showToast(t("ranking.form.validationMissingScore"), "warning");
    return;
  }

  const usernameInput = document.getElementById("ranking-username");
  const handleInput = document.getElementById("ranking-handle");
  const usernameRaw = usernameInput.value.trim();
  const handleRaw = handleInput.value.trim();

  if (!usernameRaw) {
    usernameInput.focus();
    return; 
  }

  let normalizedHandle = handleRaw.replace(/^@/, "");
  if (normalizedHandle && !/^[a-zA-Z0-9_]+$/.test(normalizedHandle)) {
    showToast(t("ranking.form.validationHandle"), "danger");
    return;
  }

  const scoreToSubmit = latestResultState ? latestResultState.score : store.state.score;
  const levelData = getLevelData(scoreToSubmit);

  const payload = {
    player_id: playerId,
    username: usernameRaw.slice(0, 32),
    handle: normalizedHandle || null,
    score: Number(scoreToSubmit) || 0,
    ota_level_ja: levelData.names.ja,
    ota_level_en: levelData.names.en,
    ota_level_ko: levelData.names.ko,
    language: getLanguage(),
  };

  const submitBtn = document.getElementById("ranking-submit-button");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = t("ranking.submit.inProgress");
  submitBtn.disabled = true;

  try {
    const { data, error } = await supabase
      .from(RANKING_TABLE)
      .insert(payload)
      .select("*")
      .maybeSingle();

    if (error) throw error;

    showToast(t("ranking.form.success"), "success");
    usernameInput.value = "";
    handleInput.value = "";
    
    await fetchRankingList();
    await fetchPersonalHistory();

  } catch (error) {
    console.error("Submission error:", error);
    showToast(t("ranking.form.error"), "danger");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function deleteRankingEntry(entryId) {
  if (!supabase || !entryId) return;
  try {
    const { error } = await supabase
      .from(RANKING_TABLE)
      .delete()
      .eq("id", entryId)
      .eq("player_id", playerId); 

    if (error) throw error;

    showToast(t("ranking.personal.deleteSuccess"), "success");
    await fetchPersonalHistory();
    await fetchRankingList(); 
  } catch (error) {
    console.error("Failed to delete ranking entry:", error);
    showToast(t("ranking.personal.deleteError"), "danger");
  }
}

function openRankingModal() {
  document.body.classList.add("modal-open");
  modals.ranking.hidden = false;
  
  const scoreVal = document.getElementById("ranking-current-score");
  const levelVal = document.getElementById("ranking-current-level");
  
  if (latestResultState) {
    const ld = getLevelData(latestResultState.score);
    scoreVal.textContent = latestResultState.score;
    levelVal.textContent = ld.names[getLanguage()];
  } else {
    scoreVal.textContent = "-";
    levelVal.textContent = "-";
  }

  fetchRankingList();
  fetchPersonalHistory();
}

function closeRankingModal() {
  document.body.classList.remove("modal-open");
  modals.ranking.hidden = true;
}


/* --- Initialization --- */
window.addEventListener("DOMContentLoaded", () => {
  initLanguageButtons();
  updateLanguageUI(getLanguage());
  
  initAudio();
  
  screens.top.hidden = false;
  screens.game.hidden = true;
  screens.result.hidden = true;
  screens.history.hidden = true;
  
  if (!isRankingEnabled) {
    console.warn("Supabase not configured. Ranking features disabled.");
    const rankingBtns = document.querySelectorAll("#btn-ranking, #btn-ranking-result");
    rankingBtns.forEach(b => b.style.display = "none");
  }
});
