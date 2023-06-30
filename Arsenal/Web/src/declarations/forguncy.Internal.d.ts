declare namespace Forguncy {
  const enum ForguncySupportCultures {
    English = 'EN',
    Chinese = 'CN',
    Japanese = 'JA',
    Korean = 'KR',
  }

  class FocusMoveHelper {
    public static AllowMoveFocusByEnterKey(control: JQuery, isInListview: boolean): void;
  }

  class RS {
    static Culture: ForguncySupportCultures;
  }

  class ImageDataHelper {
    public static IsSvg: (src: string) => boolean;
  }

  class ImageHelper {
    public static preHandleSvg(svg: JQuery, color: string);
    public static requestSvg(src: string, callback: (svg: Node) => void);
  }

  class ForguncyData {
    static pageInfo: PageInfo;
    static initListviewPaginationInfo(runTimePageName: string, listviewName: string, pageSize: number);
  }

  class PageInfo {
    pageElementManager: PageElementManager;
  }
  class PageElementManager {
    public cells: NormalCellCollection;
  }

  class NormalCellCollection {
    public getAllCells(runTimePageNames?: string[]): any[];
  }

  class ColorHelper {
    public static UpdateTint(baseColor: string, tint: number, alpha: number): string;
  }

  class ModuleLoader {
    static getCdnUrl(url: string);
  }
  class FormatHelper {
    static format(formatString: string, value: any): any;
  }
  class PageBuilder {
    public static get pageLoadingCover(): JQuery;
    public static get pageLoadingText(): JQuery;
    public static hidePageLoadingCover(): void;
    public static showPageLoadingCover(color?: string): void;
  }
}
