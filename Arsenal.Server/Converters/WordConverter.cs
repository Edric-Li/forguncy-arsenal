﻿using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Word;

namespace Arsenal.Server.Converters;

public class WordConverter
{
    public static readonly bool IsInstalled;

    private readonly string _filePath;

    private readonly string _savePath;

    private static readonly ProcessPoolManager ProcessPoolManager;

    static WordConverter()
    {
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return;
        }

        var appType = Type.GetTypeFromProgID("KWPS.Application") ?? Type.GetTypeFromProgID("Word.Application");

        IsInstalled = appType != null;

        if (IsInstalled)
        {
            ProcessPoolManager = new ProcessPoolManager(appType);
        }
    }

    public WordConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    public void ConvertToPdf()
    {
        var processes = ProcessPoolManager.GetAvailableProcesses();

        try
        {
            var document = processes.Instance.Documents.Open(_filePath);
            document.SaveAs(_savePath, WdSaveFormat.wdFormatPDF);
            document.Close();

            Marshal.ReleaseComObject(document);
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "Word转换失败," + e.Message);
            throw;
        }
        finally
        {
            processes.Release();
            ProcessPoolManager.RemoveProcess(processes);
        }
    }
}